import { ClassExp, ProcExp, Exp, Program, CExp, VarDecl, makeDefineExp, isDefineExp, isCExp, isAtomicExp, isLitExp, makeIfExp, isAppExp, isIfExp, makeAppExp, makeProcExp, isProcExp, makeLetExp, isLetExp, isClassExp, makeBinding, makeProgram, isProgram, isExp, Binding, makeBoolExp, makeVarRef, makeLitExp, makeVarDecl } from "./L3-ast";
import { Result, makeFailure, makeOk } from "../shared/result";
import { map } from "ramda";
/*
Purpose: Transform ClassExp to ProcExp
Signature: class2proc(classExp)
Type: ClassExp => ProcExp
*/
export const class2proc = (exp: ClassExp): ProcExp => {
    const fields: VarDecl[] = exp.fields;
    const methods: Binding[] = exp.methods;

    const methodCases: CExp[] = methods.map((method) => {
        const methodName = makeLitExp(`'${method.var.var}`); 
        const methodBody = method.val;
        return makeIfExp(
            makeAppExp(makeVarRef("eq?"), [makeVarRef("msg"), methodName]),
            makeAppExp(methodBody , []),
            makeBoolExp(false)
        );
    });

    const ifExpression = methodCases.reduceRight(
        (acc, curr) => {
            const ifExp = curr as any; // we need to assume curr is IfExp for chaining
            return makeIfExp(ifExp.test, ifExp.then, acc);
        },
        makeBoolExp(false)
    );

    return makeProcExp(fields, [makeProcExp([makeVarDecl("msg")], [ifExpression])]);
};
/*
Purpose: Transform all class forms in the given AST to procs
Signature: lexTransform(AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const lexTransform = (exp: Exp | Program): Result<Exp | Program> => {
    if (isProgram(exp)) {
        return makeOk(makeProgram(map(lexTransformExp, exp.exps)));
    } else if (isExp(exp)) {
        return makeOk(lexTransformExp(exp));
    } else {
        return makeFailure("Invalid AST");
    }
};

const lexTransformExp = (exp: Exp): Exp => {
    return isDefineExp(exp) ? makeDefineExp(exp.var, lexTransformCExp(exp.val)) :
        isCExp(exp) ? lexTransformCExp(exp) :
            exp;
};

const lexTransformCExp = (exp: CExp): CExp => {
    return isAtomicExp(exp) ? exp :
        isLitExp(exp) ? exp :
            isIfExp(exp) ? makeIfExp(lexTransformCExp(exp.test), lexTransformCExp(exp.then), lexTransformCExp(exp.alt)) :
                isAppExp(exp) ? makeAppExp(lexTransformCExp(exp.rator), map(lexTransformCExp, exp.rands)) :
                    isProcExp(exp) ? makeProcExp(exp.args, map(lexTransformCExp, exp.body)) :
                        isLetExp(exp) ? makeLetExp(map(lexTransformBinding, exp.bindings), map(lexTransformCExp, exp.body)) :
                            isClassExp(exp) ? lexTransformCExp(class2proc(exp)) :
                                exp;
};

const lexTransformBinding = (binding: Binding): Binding =>
    makeBinding(binding.var.var, lexTransformCExp(binding.val));
