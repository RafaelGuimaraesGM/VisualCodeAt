###############################################
## Majoras - Linguagem completa em Python   ##
###############################################

from ast import Assign, expr, stmt
import re
import tkinter as tk
from tkinter import scrolledtext, messagebox
import sys
import io
from unicodedata import name

from colorama import init

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


###############################################
## INTERFACE GRÁFICA
###############################################

def run_minilang_from_gui():
    code = text_area.get("1.0", tk.END)

    try:
        tokens = lex(code)
        parser = Parser(tokens)
        program = parser.parse()

        old_stdout = sys.stdout
        sys.stdout = io.StringIO()

        Interpreter().run(program)

        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        output_area.config(state="normal")
        output_area.delete("1.0", tk.END)
        output_area.insert(tk.END, output)
        output_area.config(state="disabled")

    except Exception as e:
        messagebox.showerror("Erro", str(e))


if __name__ == "__main__":
    root = tk.Tk()
    root.title("Majoras IDE")

    tk.Label(root, text="Código Majoras:").pack(anchor="w")
    text_area = scrolledtext.ScrolledText(root, width=80, height=25)
    text_area.pack()

    tk.Button(root, text="Executar", command=run_minilang_from_gui).pack(pady=10)

    tk.Label(root, text="Saída:").pack(anchor="w")
    output_area = scrolledtext.ScrolledText(root, width=80, height=10, state="disabled")
    output_area.pack()

    root.mainloop()