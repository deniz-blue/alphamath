# AlphaMath Project

The goal of this project is to create an application that aids users in exploring mathematics. This includes toying around equations, theorems, or just plainly solving problems.

## Data Models

Often while tackling math problems, one might get stuck because writing on a sheet of paper is linear, the logical steps required to reach the solution are not. As such, I propose having each mathematical statement be a "**Node**". **Nodes** can be one of the following:

- **Text**: for simple statements that are better expressed in words than symbols (e.g. "$f$ is continuous").
- **Relation**: A statement about a relationship between two different mathematical bjects (e.g. "$y=mx+b$", "$A \cup B \in C$", etc). It consists of two **Expressions** and a **Relation Operator**
  - **Expression**: A mathematical entity. This can be many different things, such as numbers, sets, functions, etc. **Expressions** can be defined in terms of other **Expressions** and **Operators** such as addition, subtraction, set union, etc.
  - **Relation Operator**: An operator denoting a binary relation (e.g. =, <, >, $\in$. etc).
- **Definition**: Defining a new object and giving it a name (e.g. "Def $f:\mathbb R \to \mathbb R, x \mapsto x^2$", "Def $y = -2x$, etc).

As **Nodes** are logical statements, they can be linked together with various logical operators, forming larger **Nodes**. **Nodes** can also have one-way relationships ($A \implies B$) or be equivalent ($A \equiv B$). I suggest these relationships be visually represented by arrows or special UI components, per the user's desire.

For equivalent relations, I suggest allowing a **Node** to be manipulated into other equivalent forms in place (such as moving things around in an equation), allowing the user to save the forms they deem important and switch between them at will. For example: $x^2+2x+y^2=0$ has many equivalent forms, but the user might be interested in the form $(x+1)^2+y^2=1$ and $d((x, y), (-1, 0))=1$, but not $3x^2+6x+3y^2-1000=-1000$.

As for one-way relationships, I suggest representing them as nested boxes, so if $A \implies B$, B would be shown as a box inside the box of A. This makes the idea of B being true whenever A is but not vice versa clearer. 

Other relations such as AND and OR form nodes, I suggest making the shape or layout of said node different from the aforementioned nested nodes.

The user can be given the option to branch out from a **Node** to any number of **Nodes** with different possible cases. For example $|x|>1$ can branch to $x>1$ and $x<1$. At each node, 

The user might also make custom **Nodes** and save them to their toolbox. For example one could save a **Node** with the two equivalent forms "$y'=a(x)y+b(x)$" and "$y(x) = k \cdot e^{\int a(x) \mathrm dx}+ e^{\int a(x) \mathrm dx}\int e^{-\int a(x) \mathrm dx} \cdot b(x) \mathrm dx$ if they're working with many differential equations.

## User Interface

I want it like Figma. I never really used figma but thats the best way I can exactly explain it I think.

Workspace is basically an infinitely scrollable/pannable and zoomable area where you can drag formulas, expressions, nodes and windows/gizmos around.

I really want to make most stuff being drag-and-drop-able. Being able to have $2x - 2 = x + 2$ and dragging $x$ to the left side to have it automatically subtract and become $x - 2 = 2$ would be cool.

Also yes this thing should have graphs built in like desmos but inside windows.
