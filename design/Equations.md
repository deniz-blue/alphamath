# Equations

Consider the equation $A = B$. The following actions produce equivalent ($\iff$) equations:

- Adding $C$ to both sides. $A + C = B + C$
- Multiplying both sides by a nonzero quantity. $MA = MB$
- Putting both sides through an *injective* function (like $x^3$ over real numbers). $f(A) = f(B)$

The following actions product non-equivalent ($\implies$) equations:

- Multiplying by a quantity that isn't guaranteed nonzero (like $\sin x$).
- Applying a *non-injective* function (like $x^2$).

Doing these actions in reverse can produce multiple **Nodes**:

- $AB = C$ creates the nodes $C = 0 \wedge (A = 0 \vee B = 0)$ and $C \neq 0 \wedge A \neq 0 \wedge B \neq 0$.
- For non-injective $f$, applying $f(A) = f(B)$ in reverse is hard to generalize, but a few special functions are notable:
  - $A^2=B^2$ creates the nodes $A = B$ and $A = -B$.
    - This can be generalized further for complex numbers, with $A^n = B^n$ creating $A = e^{2\pi i k/n}B$ for all $k \in {0, \dots, n-1}.
  - Trigonometric functions (sin, cos, sec, csc) cause $A = B + 2\pi n$, tan and cot cause A = B + \pi n$
  - The absolute value function behaves like $x^2$.

## Other deductions:

In some cases, extra information can be gained from equations. For example, any real equation containing square roots means the inside is positive. Denominators of fractions are always nonzero. etc.
TODO: expand on this section.