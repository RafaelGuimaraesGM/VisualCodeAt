###############################################
## Majoras - Linguagem completa em Python   ##
###############################################

from ast import Assign, expr, stmt
from email.mime import text
import re
import tkinter as tk
from tkinter import scrolledtext, messagebox
import sys
import io
from unicodedata import name

from colorama import init

# --- COLOQUE AQUI (Logo após as cores iniciais) ---
THEMES = {
    "Dark (Padrão)": {
        "bg_main": "#1e1e1e", "bg_sidebar": "#252526", "bg_console": "#0f0f0f",
        "text": "#d4d4d4", "keyword": "#569CD6", "string": "#CE9178", "number": "#B5CEA8"
    },
    "Dracula": {
        "bg_main": "#282a36", "bg_sidebar": "#21222c", "bg_console": "#191a21",
        "text": "#f8f8f2", "keyword": "#ff79c6", "string": "#f1fa8c", "number": "#bd93f9"
    },
    "One Light": {
        "bg_main": "#fafafa", "bg_sidebar": "#f0f0f0", "bg_console": "#ffffff",
        "text": "#383a42", "keyword": "#a626a4", "string": "#50a14f", "number": "#986801"
    }
    
}
CURRENT_THEME = "Dark (Padrão)" # Tema inicial

###############################################
## LEXER
###############################################

TOKEN_SPEC = [
    ("NUMBER", r"\d+"),
    ("LET", r"let"),
    ("FUNCAO", r"funcao"),
    ("SENAO", r"\bsenao\b"),
    ("SE", r"\bse\b"),
    ("PARA", r"\bpara\b"),
    ("ENQUANTO", r"enquanto"),
    ("RETORNE", r"retorne"),
    ("ESCREVA", r"escreva"),
    ("STRING", r'"(\\.|[^"\\])*"|\'(\\.|[^\'\\])*\''),
    ("BREAK", r"\bbreak\b"),
    ("CONTINUE", r"\bcontinue\b"),
    ("IDENT", r"[a-zA-Z_]\w*"),

    # operadores relacionais
    ("LE", r"<="),
    ("GE", r">="),
    ("EQEQ", r"=="),
    ("NEQ", r"!="),
    ("LT", r"<"),
    ("GT", r">"),

    ("EQ", r"="),
    ("PLUSPLUS", r"\+\+"),
    ("MINUSMINUS", r"--"),
    ("PLUS", r"\+"),
    ("MINUS", r"-"),
    ("MUL", r"\*"),
    ("DIV", r"/"),

    ("COMMA", r","),
    ("SEMICOLON", r";"),

    ("LPAREN", r"\("),
    ("RPAREN", r"\)"),
    ("LBRACE", r"\{"),
    ("RBRACE", r"\}"),

    ("NEWLINE", r"\n"),
    ("COMMENT", r"\#.*"),
    ("SKIP", r"[ \t]+"),

    ("MISMATCH", r"."),
]


def lex(code):
    tokens = []
    token_regex = "|".join(f"(?P<{n}>{p})" for n, p in TOKEN_SPEC)

    for m in re.finditer(token_regex, code):
        kind = m.lastgroup
        value = m.group()

        if kind == "NUMBER":
            tokens.append(("NUMBER", int(value)))

        elif kind == "STRING":
            tokens.append(("STRING", value))

        elif kind in {
            "LET", "FUNCAO", "SE", "PARA", "SENAO", "ENQUANTO", "RETORNE", "ESCREVA", "BREAK", "CONTINUE",
            "IDENT", "EQ", "PLUS", "MINUS", "MUL", "DIV",
            "LPAREN", "RPAREN", "LBRACE", "RBRACE", "COMMA", "SEMICOLON", "PLUSPLUS", "MINUSMINUS", 
            "LE", "GE", "EQEQ", "NEQ", "LT", "GT"
        }:
            tokens.append((kind, value))

        elif kind in {"COMMENT", "SKIP"}:
            continue

        elif kind == "NEWLINE":
            tokens.append(("NEWLINE", value))

        else:
            raise SyntaxError(f"Token inesperado: {value}")

    tokens.append(("EOF", None))
    return tokens


###############################################
## AST NODES
###############################################

class String:
    def __init__(self, value):
        self.value = value


class Number:
    def __init__(self, value):
        self.value = value


class Var:
    def __init__(self, name):
        self.name = name


class BinOp:
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right


class Let:
    def __init__(self, name, expr):
        self.name = name
        self.expr = expr


class Print:
    def __init__(self, expr):
        self.expr = expr


class Block:
    def __init__(self, statements):
        self.statements = statements


class If:
    def __init__(self, condition, then_branch, else_branch):
        self.condition = condition
        self.then_branch = then_branch
        self.else_branch = else_branch


class While:
    def __init__(self, condition, body):
        self.condition = condition
        self.body = body


class For:
    def __init__(self, init, cond, inc, body):
        self.init = init
        self.cond = cond
        self.inc = inc
        self.body = body

class Assign:
    def __init__(self, name, expr):
        self.name = name
        self.expr = expr


class Increment:
    def __init__(self, var):
        self.var = var


class Decrement:
    def __init__(self, var):
        self.var = var


class Break:
    pass


class Continue:
    pass


class Function:
    def __init__(self, name, params, body):
        self.name = name
        self.params = params
        self.body = body


class Call:
    def __init__(self, name, args):
        self.name = name
        self.args = args


class Return:
    def __init__(self, expr):
        self.expr = expr


###############################################
## PARSER
###############################################

class Parser:

    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def peek(self):
        return self.tokens[self.pos]

    def peek_next(self):
        if self.pos + 1 < len(self.tokens):
            return self.tokens[self.pos + 1]
        return ("EOF", None)

    def consume(self, kind=None):
        tok = self.peek()
        if kind and tok[0] != kind:
            raise SyntaxError(f"Esperado {kind}, encontrado {tok}")
        self.pos += 1
        return tok

    def factor(self):
        tok = self.peek()

        if tok[0] == "STRING":
            self.consume("STRING")
            raw = tok[1]
            inner = raw[1:-1]
            return String(inner)

        if tok[0] == "NUMBER":
            self.consume("NUMBER")
            return Number(tok[1])

        if tok[0] == "IDENT":
            return self.call_or_var()

        if tok[0] == "LPAREN":
            self.consume("LPAREN")
            e = self.comparison()
            self.consume("RPAREN")
            return e

        raise SyntaxError(f"Fator inválido: {tok}")

    def term(self):
        node = self.factor()
        while self.peek()[0] in ("MUL", "DIV"):
            op = self.consume()[0]
            node = BinOp(node, op, self.factor())
        return node

    def expr(self):
        node = self.term()
        while self.peek()[0] in ("PLUS", "MINUS"):
            op = self.consume()[0]
            node = BinOp(node, op, self.term())
        return node

    def comparison(self):
        node = self.expr()
        while self.peek()[0] in ("LT", "GT", "LE", "GE", "EQEQ", "NEQ"):
            op = self.consume()[0]
            node = BinOp(node, op, self.expr())
        return node

    def call_or_var(self):
        name = self.consume("IDENT")[1]

        if self.peek()[0] == "LPAREN":
            self.consume("LPAREN")
            args = []

            if self.peek()[0] != "RPAREN":
                args.append(self.comparison())
                while self.peek()[0] == "COMMA":
                    self.consume("COMMA")
                    args.append(self.comparison())

            self.consume("RPAREN")
            return Call(name, args)

        return Var(name)

    def block(self):
        self.consume("LBRACE")
        stmts = []

        while self.peek()[0] != "RBRACE":
            if self.peek()[0] == "NEWLINE":
                self.consume("NEWLINE")
                continue
            stmts.append(self.statement())

        self.consume("RBRACE")
        return Block(stmts)

    def let_statement(self):
        self.consume("LET")
        name = self.consume("IDENT")[1]
        self.consume("EQ")
        expr = self.comparison()
        return Let(name, expr)

    def assign_statement(self):
        name = self.consume("IDENT")[1]
        self.consume("EQ")
        expr = self.comparison()
        return Assign(name, expr)

    def increment_statement(self):
        name = self.consume("IDENT")[1]

        if self.peek()[0] == "PLUSPLUS":
            self.consume("PLUSPLUS")
            return Increment(name)

        if self.peek()[0] == "MINUSMINUS":
            self.consume("MINUSMINUS")
            return Decrement(name)

        raise SyntaxError("Esperado ++ ou --")

    def escreva_statement(self):
        self.consume("ESCREVA")
        return Print(self.comparison())

    def if_statement(self):
        self.consume("SE")

        if self.peek()[0] == "LPAREN":
            self.consume("LPAREN")
            cond = self.comparison()
            self.consume("RPAREN")
        else:
            cond = self.comparison()

        then_block = self.block()

        else_block = None
        if self.peek()[0] == "SENAO":
            self.consume("SENAO")
            else_block = self.block()

        return If(cond, then_block, else_block)

    def enquanto_statement(self):
        self.consume("ENQUANTO")

        if self.peek()[0] == "LPAREN":
            self.consume("LPAREN")
            cond = self.comparison()
            self.consume("RPAREN")
        else:
            cond = self.comparison()

        body = self.block()
        return While(cond, body)

    def para_statement(self):
        self.consume("PARA")
        self.consume("LPAREN")

        if self.peek()[0] == "LET":
            init = self.let_statement()
        elif self.peek()[0] == "IDENT" and self.peek_next()[0] == "EQ":
            init = self.assign_statement()
        else:
            raise SyntaxError("Inicialização inválida no para")

        self.consume("SEMICOLON")

        cond = self.comparison()

        self.consume("SEMICOLON")

        if self.peek()[0] == "IDENT" and self.peek_next()[0] in ("PLUSPLUS", "MINUSMINUS"):
            inc = self.increment_statement()
        elif self.peek()[0] == "IDENT" and self.peek_next()[0] == "EQ":
            inc = self.assign_statement()
        else:
            raise SyntaxError("Incremento inválido no para")

        self.consume("RPAREN")

        body = self.block()
        return For(init, cond, inc, body)

    def funcao_statement(self):
        self.consume("FUNCAO")
        name = self.consume("IDENT")[1]

        self.consume("LPAREN")
        params = []

        if self.peek()[0] != "RPAREN":
            params.append(self.consume("IDENT")[1])
            while self.peek()[0] == "COMMA":
                self.consume("COMMA")
                params.append(self.consume("IDENT")[1])

        self.consume("RPAREN")
        body = self.block()
        return Function(name, params, body)

    def retorne_statement(self):
        self.consume("RETORNE")
        return Return(self.comparison())

    def break_statement(self):
        self.consume("BREAK")
        return Break()

    def continue_statement(self):
        self.consume("CONTINUE")
        return Continue()

    def statement(self):
        tok = self.peek()[0]

        if tok == "LET":
            return self.let_statement()

        if tok == "ESCREVA":
            return self.escreva_statement()

        if tok == "SE":
            return self.if_statement()

        if tok == "SENAO":
            raise SyntaxError("senao sem se correspondente")

        if tok == "ENQUANTO":
            return self.enquanto_statement()

        if tok == "PARA":
            return self.para_statement()

        if tok == "FUNCAO":
            return self.funcao_statement()

        if tok == "RETORNE":
            return self.retorne_statement()

        if tok == "BREAK":
            return self.break_statement()

        if tok == "CONTINUE":
            return self.continue_statement()

        if tok == "IDENT" and self.peek_next()[0] == "EQ":
            return self.assign_statement()

        if tok == "IDENT" and self.peek_next()[0] in ("PLUSPLUS", "MINUSMINUS"):
            return self.increment_statement()

        raise SyntaxError(f"Comando inválido: {tok}")

    def parse(self):
        program = []

        while self.peek()[0] != "EOF":
            if self.peek()[0] == "NEWLINE":
                self.consume("NEWLINE")
                continue
            program.append(self.statement())

        return program


###############################################
## INTERPRETADOR
###############################################

class BreakException(Exception):
    pass


class ContinueException(Exception):
    pass


class Interpreter:

    def __init__(self):
        self.globals = {}
        self.callstack = []

    def get_var(self, name):
        for scope in reversed(self.callstack):
            if name in scope:
                return scope[name]
        if name in self.globals:
            return self.globals[name]
        raise NameError(f"Variável não definida: {name}")

    def set_var(self, name, value):
        if self.callstack:
            self.callstack[-1][name] = value
        else:
            self.globals[name] = value

    def call_function(self, fn, args):
        new_scope = {}

        for param, value in zip(fn.params, args):
            new_scope[param] = value

        self.callstack.append(new_scope)
        result = self.run_block(fn.body)
        self.callstack.pop()

        return result

    def eval_expr(self, node):

        if isinstance(node, String):
            return node.value

        if isinstance(node, Number):
            return node.value

        if isinstance(node, Var):
            return self.get_var(node.name)

        if isinstance(node, BinOp):
            left = self.eval_expr(node.left)
            right = self.eval_expr(node.right)

            if node.op == "PLUS":
                return left + right
            if node.op == "MINUS":
                return left - right
            if node.op == "MUL":
                return left * right
            if node.op == "DIV":
                return left / right
            if node.op == "LT":
                return left < right
            if node.op == "GT":
                return left > right
            if node.op == "LE":
                return left <= right
            if node.op == "GE":
                return left >= right
            if node.op == "EQEQ":
                return left == right
            if node.op == "NEQ":
                return left != right

            raise RuntimeError(f"Operador inválido: {node.op}")

        if isinstance(node, Call):
            if node.name not in self.globals:
                raise NameError(f"Função não definida: {node.name}")

            fn = self.globals[node.name]
            args = [self.eval_expr(a) for a in node.args]
            return self.call_function(fn, args)

    def run_block(self, block):
        for stmt in block.statements:
            result = self.run_stmt(stmt)
            if result is not None:
                return result

    def _check_suspicious_for(self, stmt):
        # Detecta casos simples que provavelmente geram loop infinito
        # Exemplo ruim: para (let i = 0; i < 10; i--)
        # Exemplo ruim: para (let i = 10; i > 0; i++)

        if not isinstance(stmt.init, Let):
            return

        if not isinstance(stmt.init.expr, Number):
            return

        if not isinstance(stmt.cond, BinOp):
            return

        if not isinstance(stmt.cond.left, Var):
            return

        if not isinstance(stmt.cond.right, Number):
            return

        var_name = stmt.init.name
        cond_var = stmt.cond.left.name

        if var_name != cond_var:
            return

        op = stmt.cond.op

        if isinstance(stmt.inc, Increment):
            if stmt.inc.var != var_name:
                return

            if op in ("GT", "GE"):
                raise RuntimeError(
                    f"Possível loop infinito no para: variável '{var_name}' está aumentando, "
                    f"mas a condição usa operador incompatível."
                )

        elif isinstance(stmt.inc, Decrement):
            if stmt.inc.var != var_name:
                return

            if op in ("LT", "LE"):
                raise RuntimeError(
                    f"Possível loop infinito no para: variável '{var_name}' está diminuindo, "
                    f"mas a condição usa operador incompatível."
                )

    def _run_for_with_guard(self, stmt, max_iter=100000):
        self.run_stmt(stmt.init)
        self._check_suspicious_for(stmt)

        iterations = 0

        while self.eval_expr(stmt.cond):
            iterations += 1

            if iterations > max_iter:
                raise RuntimeError(
                    f"Laço 'para' excedeu {max_iter} iterações. Possível loop infinito."
                )

            try:
                self.run_block(stmt.body)
            except ContinueException:
                self.run_stmt(stmt.inc)
                continue
            except BreakException:
                break

            self.run_stmt(stmt.inc)

    def run_stmt(self, stmt):

        if isinstance(stmt, Let):
            val = self.eval_expr(stmt.expr)
            self.set_var(stmt.name, val)

        elif isinstance(stmt, Assign):
            val = self.eval_expr(stmt.expr)
            self.set_var(stmt.name, val)

        elif isinstance(stmt, Print):
            print(self.eval_expr(stmt.expr))

        elif isinstance(stmt, If):
            cond = self.eval_expr(stmt.condition)
            if cond:
                return self.run_block(stmt.then_branch)
            elif stmt.else_branch:
                return self.run_block(stmt.else_branch)

        elif isinstance(stmt, While):
            while self.eval_expr(stmt.condition):
                try:
                    self.run_block(stmt.body)
                except ContinueException:
                    continue
                except BreakException:
                    break

        elif isinstance(stmt, For):
            self._run_for_with_guard(stmt)

        elif isinstance(stmt, Function):
            self.globals[stmt.name] = stmt

        elif isinstance(stmt, Return):
            return self.eval_expr(stmt.expr)

        elif isinstance(stmt, Increment):
            val = self.get_var(stmt.var)
            self.set_var(stmt.var, val + 1)

        elif isinstance(stmt, Decrement):
            val = self.get_var(stmt.var)
            self.set_var(stmt.var, val - 1)

        elif isinstance(stmt, Break):
            raise BreakException()

        elif isinstance(stmt, Continue):
            raise ContinueException()

    def run(self, program):
        self.callstack.append({})
        for stmt in program:
            self.run_stmt(stmt)


###############################################
## MAIN – CÓDIGO DE TESTE
###############################################

if __name__ == "__main__":

    code = """
# exemplo de Majoras

escreva ("Olá Mundo")
escreva ("Linguagem Majoras em PT-BR")

let x = 10

escreva(x)

let y = 10

escreva(x + y)

se x < 100 {
    escreva ("Menor que 100")
}
"""

    tokens = lex(code)
    parser = Parser(tokens)
    program = parser.parse()

    print("------ Saída do programa ------")
    Interpreter().run(program)

#####################################################
# INTERFACE GRÁFICA COM TKINTER 
#####################################################

import tkinter as tk
import tkinter.ttk as ttk
from tkinter import filedialog, messagebox
import os
import sys
import io

###############################################
# TEMA E CORES
###############################################
BG_MAIN = "#1e1e1e"
BG_SIDEBAR = "#252526"
BG_TOOLBAR = "#333333"
BG_CONSOLE = "#0f0f0f"

TEXT_COLOR = "#d4d4d4"
KEYWORD_COLOR = "#569CD6"

FONT_EDITOR = ("JetBrains Mono", 13)
FONT_UI = ("Segoe UI", 10)

KEYWORDS = [
    "let","se","senao","para","enquanto",
    "funcao","retorne","escreva","break","continue"
]

AUTOCOMPLETE_WORDS = KEYWORDS.copy()

###############################################
# AUTOCOMPLETE
###############################################

autocomplete_listbox = None

def hide_autocomplete():
    global autocomplete_listbox
    if autocomplete_listbox:
        autocomplete_listbox.destroy()
        autocomplete_listbox = None


def get_current_word(text):
    cursor = text.index("insert")
    line, col = cursor.split(".")
    line_text = text.get(f"{line}.0", cursor)

    match = re.search(r"[a-zA-Z_]\w*$", line_text)
    if match:
        return match.group(), match.start()

    return "", None


def show_autocomplete(text):
    global autocomplete_listbox
    word, start = get_current_word(text)

    if not word:
        hide_autocomplete()
        return

    matches = [w for w in AUTOCOMPLETE_WORDS if w.startswith(word)]
    if not matches:
        hide_autocomplete()
        return

    if not autocomplete_listbox:
        autocomplete_listbox = tk.Listbox(
            text,
            height=min(5, len(matches)),
            bg="#2b2b2b",
            fg="white",
            font=FONT_EDITOR,
            takefocus=0, # IMPORTANTE: não rouba o foco do teclado
            selectbackground="#0e639c"
        )
        
    # Atualiza o conteúdo da lista
    autocomplete_listbox.delete(0, "end")
    for m in matches:
        autocomplete_listbox.insert("end", m)

    bbox = text.bbox("insert")
    if bbox:
        x, y, w, h = bbox
        autocomplete_listbox.place(x=x, y=y + h)
    
    autocomplete_listbox.selection_set(0)
    autocomplete_listbox.activate(0)


def apply_autocomplete(text):
    global autocomplete_listbox

    if not autocomplete_listbox:
        return

    word, start = get_current_word(text)
    if start is None:
        return

    # Pega a seleção da lista (ex: "escreva")
    selection = autocomplete_listbox.get("active")

    # Mapeamento de atalhos manuais (Snippets)
    snippets = {
        "esc": "escreva",
        "fun": "funcao",
        "ret": "retorne",
        "enq": "enquanto"
    }
    
    # Se o que foi digitado estiver no dicionário, usa o valor completo
    final_text = snippets.get(word, selection)

    cursor = text.index("insert")
    line, col = cursor.split(".")
    start_index = f"{line}.{start}"

    # Deleta o atalho (ex: 'esc') e insere o completo (ex: 'escreva')
    text.delete(start_index, cursor)
    text.insert(start_index, final_text)

    hide_autocomplete()


def autocomplete_event(event):
    editor = get_current_editor()
    if not editor: return
    text = editor["text"]

    if event.keysym in ("Return", "Tab"):
        if autocomplete_listbox:
            apply_autocomplete(text)
            return "break" # Impede o Tab de sair da caixa de texto
        return

    # Se a lista não existir, mas o usuário apertar Tab após digitar algo
    # podemos forçar a abertura ou expansão aqui se desejar.
    
    text.after(1, lambda: show_autocomplete(text))


###############################################
# SYNTAX HIGHLIGHT
###############################################

def highlight(text):
    # Remove todas as tags antigas para não acumular cores
    for tag in text.tag_names():
        text.tag_delete(tag)

    content = text.get("1.0", "end-1c")
    
    # PEGA AS CORES DO TEMA ATUAL (Essa é a parte que mudou!)
    theme = THEMES[CURRENT_THEME]

    # CONFIGURAÇÃO DAS CORES USANDO O TEMA
    text.tag_config("keyword", foreground=theme["keyword"], font=("JetBrains Mono", 13, "bold"))
    text.tag_config("number", foreground=theme["number"])
    text.tag_config("string", foreground=theme["string"])
    text.tag_config("function", foreground="#DCDCAA") # Pode adicionar no THEMES depois se quiser
    text.tag_config("variable", foreground="#9CDCFE")

    # PALAVRAS-CHAVE
    for kw in KEYWORDS:
        start_index = "1.0"
        while True:
            pos = text.search(r"\b" + kw + r"\b", start_index, stopindex="end", regexp=True)
            if not pos:
                break
            end_index = f"{pos}+{len(kw)}c"
            text.tag_add("keyword", pos, end_index)
            start_index = end_index

    # STRINGS
    for match in re.finditer(r'\".*?\"|\'.*?\'', content):
        start = f"1.0+{match.start()}c"
        end = f"1.0+{match.end()}c"
        text.tag_add("string", start, end)

    # NÚMEROS
    for match in re.finditer(r"\b\d+\b", content):
        start = f"1.0+{match.start()}c"
        end = f"1.0+{match.end()}c"
        text.tag_add("number", start, end)

    # FUNÇÕES
    for match in re.finditer(r"\b([a-zA-Z_]\w*)\s*(?=\()", content):
        start = f"1.0+{match.start()}c"
        end = f"1.0+{match.end(1)}c"
        text.tag_add("function", start, end)

    # VARIÁVEIS
    for match in re.finditer(r"\b[a-zA-Z_]\w*\b", content):
        start = f"1.0+{match.start()}c"
        end = f"1.0+{match.end()}c"
        tags_no_local = text.tag_names(start)
        if "keyword" in tags_no_local or "function" in tags_no_local:
            continue
        text.tag_add("variable", start, end)


###############################################
# EDITOR TABS
###############################################
editors = {}

def sync_scroll_lines_and_text(*args):
    editor = get_current_editor()
    if not editor:
        return
    editor["text"].yview(*args)
    editor["lines"].yview(*args)

def on_text_scroll(first, last):
    editor = get_current_editor()
    if not editor:
        return
    editor["lines"].yview_moveto(first)

def create_editor(filename="novo.maj", content=""):
    frame = tk.Frame(tabs, bg=BG_MAIN)

    editor_area = tk.Frame(frame, bg=BG_MAIN)
    editor_area.pack(fill="both", expand=True)

    lines = tk.Text(
        editor_area,
        width=4,
        bg="#2b2b2b",
        fg="#858585",
        font=FONT_EDITOR,
        state="disabled"
    )
    lines.pack(side="left", fill="y")

    text = tk.Text(
        editor_area,
        font=FONT_EDITOR,
        bg=BG_MAIN,
        fg=TEXT_COLOR,
        insertbackground="white",
        undo=True,
        borderwidth=0,
        yscrollcommand=on_text_scroll
    )
    text.pack(side="left", fill="both", expand=True)

    # inserir conteúdo inicial
    text.insert("1.0", content)

    # eventos
    text.bind("<KeyRelease>", update_lines, add="+")
    text.bind("<KeyRelease>", update_cursor, add="+")
    text.bind("<KeyPress>", autocomplete_event, add="+")
    text.bind("<ButtonRelease>", update_lines, add="+")
    text.bind("<ButtonRelease>", update_cursor, add="+")
    text.bind("<<Paste>>", update_lines, add="+")
    text.bind("<<Cut>>", update_lines, add="+")
    text.bind("<Return>", update_lines, add="+")
    text.bind("<BackSpace>", update_lines, add="+")
    text.bind("<Delete>", update_lines, add="+")
    tabs.add(frame, text=os.path.basename(filename))

    editors[frame] = {
        "text": text,
        "lines": lines,
        "file": filename
    }

    update_lines()

###############################################
# LINE NUMBERS
###############################################
def update_lines(event=None):
    editor = get_current_editor()
    if not editor:
        return

    text = editor["text"]
    ln = editor["lines"]

    total_linhas = int(text.index("end-1c").split(".")[0])

    ln.config(state="normal")
    ln.delete("1.0", "end")

    for i in range(1, total_linhas + 1):
        ln.insert("end", f"{i}\n")

    ln.config(state="disabled")

    # mantém a barra de linhas sincronizada com o scroll do editor
    first, last = text.yview()
    ln.yview_moveto(first)

    highlight(text)

###############################################
# CURSOR STATUS
###############################################
def update_cursor(event=None):
    editor = get_current_editor()
    if not editor: return
    text = editor["text"]
    row, col = text.index("insert").split(".")
    status_var.set(f"Linha {row} | Coluna {int(col)+1}")

###############################################
# GET CURRENT EDITOR
###############################################
def get_current_editor():
    tab = tabs.select()
    if not tab: return None
    frame = root.nametowidget(tab)
    return editors.get(frame)

###############################################
# EXECUTAR CÓDIGO
###############################################
def run_minilang_from_gui(event=None):
    editor = get_current_editor()
    if not editor: return
    code = editor["text"].get("1.0","end")
    try:
        tokens = lex(code)
        parser = Parser(tokens)
        program = parser.parse()
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        Interpreter().run(program)
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        console.config(state="normal")
        console.delete("1.0","end")
        console.insert("end", output)
        console.config(state="disabled")
        status_var.set("Programa executado")
    except Exception as e:
        messagebox.showerror("Erro", str(e))
        status_var.set("Erro")

###############################################
# FILE FUNCTIONS
###############################################
def new_file():
    create_editor()

def open_file():
    file = filedialog.askopenfilename(filetypes=[("Majoras","*.maj"),("Todos","*.*")])
    if not file: return
    with open(file,"r",encoding="utf8") as f:
        content = f.read()
    create_editor(file, content)

def save_file(event=None):
    editor = get_current_editor()
    if not editor: return
    file = filedialog.asksaveasfilename(defaultextension=".maj")
    if not file: return
    with open(file,"w",encoding="utf8") as f:
        f.write(editor["text"].get("1.0","end"))

###############################################
# FUNÇÕES DO EXPLORER (Movi para cá para evitar erro de leitura)
###############################################
def process_folder(parent, path):
    try:
        for item in os.listdir(path):
            full = os.path.join(path, item)
            node = tree.insert(parent, "end", text=item, values=[full])
            if os.path.isdir(full):
                process_folder(node, full)
    except PermissionError:
        pass

def load_folder(path="."):
    tree.delete(*tree.get_children())
    root_node = tree.insert("", "end", text=os.path.basename(os.path.abspath(path)), open=True, values=[path])
    process_folder(root_node, path)

def open_from_explorer(event):
    item = tree.focus()
    if not item: return
    path = tree.item(item, "values")[0]
    if os.path.isdir(path): return
    try:
        with open(path, "r", encoding="utf8") as f:
            content = f.read()
        create_editor(path, content)
    except: pass

# Função nova para limpar o console
def clear_console():
    console.config(state="normal")
    console.delete("1.0", "end")
    console.config(state="disabled")
    
# --- COLOQUE ABAIXO DE clear_console() ---
def change_theme(theme_name):
    global CURRENT_THEME
    CURRENT_THEME = theme_name
    theme = THEMES[theme_name]
    
    # Atualiza o console
    console.config(bg=theme["bg_console"], fg="#00ff9c" if theme_name != "One Light" else "#111111")
    
    # Atualiza todos os editores abertos
    for frame, data in editors.items():
        txt = data["text"]
        ln = data["lines"]
        txt.config(bg=theme["bg_main"], fg=theme["text"], insertbackground=theme["text"])
        ln.config(bg=theme["bg_sidebar"])
        highlight(txt) # Re-aplica as cores no texto
    
    status_var.set(f"Tema alterado para {theme_name}")    

###############################################
# INTERFACE PRINCIPAL 
###############################################
root = tk.Tk()
root.title("Majoras IDE")
root.geometry("1400x800")
root.configure(bg=BG_MAIN)

###############################################
# MENU
###############################################
menubar = tk.Menu(root)
file_menu = tk.Menu(menubar, tearoff=0)
file_menu.add_command(label="Novo", command=new_file)
file_menu.add_command(label="Abrir", command=open_file)
file_menu.add_command(label="Salvar", command=save_file)
menubar.add_cascade(label="Arquivo", menu=file_menu)

run_menu = tk.Menu(menubar, tearoff=0)
run_menu.add_command(label="Executar (F5)", command=run_minilang_from_gui)
menubar.add_cascade(label="Executar", menu=run_menu)

# --- COLOQUE NA SEÇÃO DE MENU ---
theme_menu = tk.Menu(menubar, tearoff=0)
theme_menu.add_command(label="Dark (Padrão)", command=lambda: change_theme("Dark (Padrão)"))
theme_menu.add_command(label="Dracula", command=lambda: change_theme("Dracula"))
theme_menu.add_command(label="One Light", command=lambda: change_theme("One Light"))
menubar.add_cascade(label="Temas", menu=theme_menu)

root.config(menu=menubar)

###############################################
# TOOLBAR
###############################################
toolbar = tk.Frame(root, bg="#2d2d2d", height=32)
toolbar.pack(fill="x")

tk.Button(toolbar, text="▶ Executar", command=run_minilang_from_gui, bg="#0e639c", fg="white", relief="flat", font=FONT_UI, padx=10).pack(side="left", padx=10, pady=4)
# Botão novo na Toolbar
tk.Button(toolbar, text="🗑 Limpar Console", command=clear_console, bg="#333333", fg="white", relief="flat", font=FONT_UI, padx=10).pack(side="left", padx=5, pady=4)

###############################################
# ESTILO MODERNO (TTK)
###############################################
style = ttk.Style()
style.theme_use("clam")
style.configure("Treeview", background="#1e1e1e", foreground="#d4d4d4", fieldbackground="#1e1e1e", borderwidth=0, rowheight=24)
style.map("Treeview", background=[("selected", "#264f78")])
style.configure("TNotebook", background="#1e1e1e", borderwidth=0)
style.configure("TNotebook.Tab", background="#2d2d2d", foreground="#cccccc", padding=[12,6])
style.map("TNotebook.Tab", background=[("selected","#1e1e1e")], foreground=[("selected","white")])

###############################################
# LAYOUT PRINCIPAL
###############################################
main = ttk.PanedWindow(root, orient=tk.HORIZONTAL)
main.pack(fill="both", expand=True)

###############################################
# BARRA DE ÍCONES (ESTILO VSCODE)
###############################################
icon_bar = tk.Frame(main, bg="#333333", width=50)
main.add(icon_bar, weight=0)

# Funções de efeito visual para os botões
def on_enter(e): e.widget['bg'] = "#454545"
def on_leave(e): e.widget['bg'] = "#333333"

for icon in ["📁", "🔍", "⚙"]:
    btn = tk.Button(icon_bar, text=icon, bg="#333333", fg="white", relief="flat", font=("Segoe UI", 16))
    btn.pack(pady=12, fill="x")
    btn.bind("<Enter>", on_enter)
    btn.bind("<Leave>", on_leave)

###############################################
# EXPLORER
###############################################
explorer_frame = tk.Frame(main, bg=BG_SIDEBAR, width=250)

title = tk.Label(explorer_frame, text="EXPLORER", bg=BG_SIDEBAR, fg="#cccccc", font=("Segoe UI",9,"bold"))
title.pack(anchor="w", padx=10, pady=6)

tree_scroll = tk.Scrollbar(explorer_frame)
tree_scroll.pack(side="right", fill="y")

tree = ttk.Treeview(explorer_frame, yscrollcommand=tree_scroll.set)
tree.pack(fill="both", expand=True)
tree_scroll.config(command=tree.yview)

# BIND do Explorer
tree.bind("<Double-1>", open_from_explorer)

main.add(explorer_frame, weight=1)

###############################################
# EDITOR + CONSOLE
###############################################
editor_area = ttk.PanedWindow(main, orient=tk.VERTICAL)

tabs = ttk.Notebook(editor_area)
tabs.pack(fill="both", expand=True)

editor_area.add(tabs, weight=4)

# Melhoria no Console (adicionado um pequeno header)
console_container = tk.Frame(editor_area, bg="#0f0f0f")
console_label = tk.Label(console_container, text=" SAÍDA", bg="#252526", fg="#858585", font=("Segoe UI", 7), anchor="w")
console_label.pack(fill="x")

console = tk.Text(console_container, height=10, bg="#0f0f0f", fg="#00ff9c", insertbackground="white", font=("JetBrains Mono", 12), borderwidth=0, padx=10, pady=10)
console.pack(fill="both", expand=True)

editor_area.add(console_container, weight=1)
main.add(editor_area, weight=4)

###############################################
# STATUS BAR (Adicionado info de encoding)
###############################################
status_var = tk.StringVar()
status_var.set("Majoras IDE pronto")

status_frame = tk.Frame(root, bg="#181818")
status_frame.pack(fill="x")

status = tk.Label(status_frame, textvariable=status_var, anchor="w", bg="#181818", fg="#cccccc", font=FONT_UI, padx=10)
status.pack(side="left")

tk.Label(status_frame, text="UTF-8 | Majoras Language", bg="#181818", fg="#555555", font=FONT_UI, padx=10).pack(side="right")

###############################################
# SHORTCUTS
###############################################
root.bind("<F5>", run_minilang_from_gui)
root.bind("<Control-s>", save_file)
root.bind("<Control-n>", lambda e: new_file()) # Atalho para novo arquivo
root.bind("<F6>", lambda e: clear_console()) 

###############################################
# INICIALIZAÇÃO
###############################################
create_editor()
load_folder(".")

root.mainloop()