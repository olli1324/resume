// =================== DATA ===================

const TOPICS = [
  // PHASE I - FOUNDATIONS
  { id: 'linalg', phase: 'foundations', priority: 'light', title: 'Vectors, gradients, Hessians',
    desc: 'Gradient and Hessian of a quadratic form, projections onto a subspace, the geometry behind first-order conditions.' },
  { id: 'svd', phase: 'foundations', priority: 'light', title: 'Symmetric matrices &amp; the SVD',
    desc: 'Spectral theorem, Rayleigh quotient, when a matrix is PSD, the SVD, and the Schur complement trick.' },
  { id: 'ls', phase: 'foundations', priority: 'light', title: 'Least squares &amp; normal equations',
    desc: 'The LS objective as a quadratic, normal equations, the pseudoinverse, and LS as orthogonal projection.' },

  // PHASE II - CONVEXITY & STANDARD FORMS
  { id: 'convexity', phase: 'theory', priority: 'core', title: 'Convex sets &amp; convex functions',
    desc: 'The two definitions and the trap between them. Epigraph, sublevel sets, operations that preserve convexity, first- and second-order conditions.' },
  { id: 'cvxprob', phase: 'theory', priority: 'core', title: 'Convex problems &amp; optimality',
    desc: 'Standard form, local equals global, problem transformations, and the optimality conditions for unconstrained and constrained problems.' },
  { id: 'lp', phase: 'theory', priority: 'core', title: 'Linear programming',
    desc: 'Polyhedra, standard vs inequality form, the simplex and interior-point methods, and the LP-as-Chebyshev vs LP-as-l1 reformulations.' },
  { id: 'qp', phase: 'theory', priority: 'core', title: 'Quadratic programming',
    desc: 'Quadratic forms and the sign of the Hessian, the QP standard form, unconstrained minimization, Markowitz, and the LASSO.' },
  { id: 'socp', phase: 'theory', priority: 'core', title: 'Second-order cone programs',
    desc: 'The ice-cream cone, the norm-leq-affine constraint, how LP and QP sit inside SOCP, and chance constraints.' },
  { id: 'gp', phase: 'theory', priority: 'core', title: 'Geometric programming',
    desc: 'Monomials and posynomials, why a minus sign breaks a posynomial, and the log-substitution that makes a GP convex.' },
  { id: 'duality', phase: 'theory', priority: 'core', title: 'Lagrangian duality &amp; KKT',
    desc: 'The Lagrangian, the dual function, weak vs strong duality, Slater, the KKT conditions, and dual variables as sensitivities.' },

  // PHASE III - ALGORITHMS
  { id: 'gradient', phase: 'algorithms', priority: 'core', title: 'Gradient descent',
    desc: 'Steepest descent, the Armijo condition and backtracking, the descent lemma, and O(1/k) vs linear convergence.' },
  { id: 'newton', phase: 'algorithms', priority: 'core', title: "Newton's method",
    desc: 'The Newton step, affine invariance, the Newton decrement, damped vs pure Newton, and quadratic convergence.' },
  { id: 'constrained', phase: 'algorithms', priority: 'core', title: 'Constrained optimization',
    desc: 'Projected gradient on simple sets, the log-barrier and the central path, the barrier method, and phase 1.' },
];

// ============= READING CONTENT =============
const CONTENT = {
  linalg: {
    title: 'Vectors, gradients, Hessians',
    lead: 'Before convexity comes the calculus it is built on. The gradient and Hessian of a quadratic form are the two objects you compute most often on the exam, so get them automatic.',
    body: `
      <h3>Gradient and Hessian of a quadratic form</h3>
      <p>Almost every algorithm and optimality condition in this course is stated in terms of a gradient $\\nabla f$ and a Hessian $\\nabla^2 f$. The generic quadratic function is the one to know cold:</p>
      <div class="formula-block"><div class="label">Quadratic function and its derivatives</div>$$f(x) = \\tfrac{1}{2} x^\\top H x + c^\\top x + d, \\qquad \\nabla f(x) = Hx + c, \\qquad \\nabla^2 f(x) = H$$</div>
      <p>Here $H$ is symmetric. Two things follow immediately. First, the stationary points solve the linear system $Hx = -c$. Second, the Hessian is constant and equal to $H$, so the curvature of $f$ is the same everywhere &mdash; that is why quadratics are the model problem for both gradient descent and Newton's method.</p>
      <p>The least-squares objective $f(x) = \\lVert Ax - y \\rVert_2^2$ is a quadratic in disguise, with $H = 2A^\\top A$, $c = -2A^\\top y$, $d = \\lVert y \\rVert_2^2$. Since $A^\\top A \\succeq 0$ always, the LS objective is convex.</p>

      <h3>First-order geometry</h3>
      <p>At a point $x$ with $\\nabla f(x) \\neq 0$, the gradient splits $\\mathbb{R}^n$ into two halves. Moving in a direction $v$ with $\\nabla f(x)^\\top v > 0$ increases $f$; moving with $\\nabla f(x)^\\top v < 0$ is a descent direction. The negative gradient $-\\nabla f(x)$ is the steepest descent direction in the Euclidean norm. This is the entire idea behind gradient descent.</p>

      <h3>Projection onto a subspace</h3>
      <p>The orthogonal projection of $y$ onto the range of $A$ (with $A$ full column rank) is</p>
      <div class="formula-block">$$P_{R(A)}\\, y = A(A^\\top A)^{-1} A^\\top y.$$</div>
      <p>This is also the least-squares prediction $A\\hat{x}$. Projection onto simpler sets &mdash; a box, a ball, the simplex &mdash; reappears later as the core step of the projected gradient algorithm.</p>

      <div class="key-box">
        <div class="label">What to have automatic</div>
        <ul>
          <li>$\\nabla(\\tfrac12 x^\\top H x + c^\\top x) = Hx + c$ and $\\nabla^2 = H$. No exceptions, no second-guessing.</li>
          <li>A symmetric matrix is PSD ($H \\succeq 0$) iff all its eigenvalues are $\\geq 0$. PD ($H \\succ 0$) iff all $> 0$.</li>
          <li>Descent direction means negative inner product with the gradient.</li>
        </ul>
      </div>
    `
  },

  svd: {
    title: 'Symmetric matrices & the SVD',
    lead: 'The spectral theorem and the SVD are the linear-algebra spine of the course. Convexity of a quadratic, the meaning of PSD, low-rank approximation, and the Schur complement all run through here.',
    body: `
      <h3>The spectral theorem</h3>
      <p>Any symmetric matrix $A \\in \\mathbb{R}^{n,n}$ is orthogonally similar to a diagonal matrix: there is an orthogonal $U$ (so $U^\\top U = I$) and real eigenvalues $\\lambda_i$ with</p>
      <div class="formula-block"><div class="label">Spectral factorization</div>$$A = U \\Lambda U^\\top, \\qquad \\Lambda = \\mathrm{diag}(\\lambda_1, \\dots, \\lambda_n).$$</div>
      <p>Symmetric matrices always have real eigenvalues and an orthonormal eigenvector basis. This is what makes "the sign of the eigenvalues" a well-posed question.</p>

      <h3>Positive semidefinite matrices</h3>
      <p>A symmetric $A$ is <strong>positive semidefinite</strong>, written $A \\succeq 0$, when $x^\\top A x \\geq 0$ for all $x$ &mdash; equivalently, all eigenvalues $\\lambda_i \\geq 0$. It is <strong>positive definite</strong> ($A \\succ 0$) when all $\\lambda_i > 0$. Useful facts: $A^\\top A \\succeq 0$ always; $A^\\top A \\succ 0$ iff $A$ has full column rank; and $A \\succeq 0$ iff $A = B^\\top B$ for some $B$.</p>

      <h3>The Rayleigh quotient</h3>
      <p>For symmetric $A$, the ratio $\\frac{x^\\top A x}{x^\\top x}$ is the Rayleigh quotient. Its maximum over $x \\neq 0$ is the largest eigenvalue $\\lambda_{\\max}$, attained along the corresponding eigenvector; its minimum is $\\lambda_{\\min}$. This is the variational characterization of the extreme eigenvalues.</p>

      <h3>The singular value decomposition</h3>
      <p>The SVD generalizes the spectral factorization to any matrix, square or rectangular:</p>
      <div class="formula-block"><div class="label">SVD</div>$$A = U \\Sigma V^\\top, \\qquad U^\\top U = I, \\quad V^\\top V = I, \\quad \\Sigma = \\mathrm{diag}(\\sigma_1, \\dots, \\sigma_r), \\ \\sigma_i > 0.$$</div>
      <p>The $\\sigma_i$ are the singular values; the columns of $U$ and $V$ are the left and right singular vectors. The $u_i$ are eigenvectors of $AA^\\top$, the $v_i$ are eigenvectors of $A^\\top A$, and $\\sigma_i^2$ are the corresponding eigenvalues. The rank of $A$ is the count of nonzero singular values. The spectral norm $\\lVert A \\rVert_2 = \\sigma_{\\max}$, and the squared Frobenius norm is $\\sum_i \\sigma_i^2$.</p>
      <p>For a <strong>symmetric PSD matrix the SVD and the eigendecomposition coincide</strong>: $\\sigma_i = \\lambda_i$ and $U = V$. This is why questions that ask for "the SVD of $A$" when $A$ is symmetric PSD just want the eigendecomposition.</p>

      <h3>The Schur complement</h3>
      <p>For a block symmetric matrix with $B \\succ 0$,</p>
      <div class="formula-block">$$\\begin{bmatrix} A & X \\\\ X^\\top & B \\end{bmatrix} \\succeq 0 \\quad \\Longleftrightarrow \\quad A - X B^{-1} X^\\top \\succeq 0.$$</div>
      <p>The Schur complement converts a nonlinear matrix inequality into a linear one (an LMI), which is the single trick that does most of the work in SDP modeling.</p>

      <div class="key-box">
        <div class="label">The disambiguation that matters here</div>
        <ul>
          <li>Eigendecomposition is for symmetric matrices; SVD is for any matrix. They coincide for symmetric PSD.</li>
          <li>$A \\succeq 0$ is the condition under which $\\tfrac12 x^\\top A x + c^\\top x$ is convex. $A \\succ 0$ makes it strongly convex.</li>
          <li>Schur complement: use it to turn $A - XB^{-1}X^\\top \\succeq 0$ into a single block LMI, or vice versa.</li>
        </ul>
      </div>
    `
  },

  ls: {
    title: 'Least squares & normal equations',
    lead: 'Least squares is the simplest non-trivial convex problem: a convex quadratic with no constraints. The normal equations and the projection picture both come from one calculation.',
    body: `
      <h3>The problem</h3>
      <p>Given $A \\in \\mathbb{R}^{m,n}$ and $y \\in \\mathbb{R}^m$, the least-squares problem minimizes the squared $\\ell_2$ residual:</p>
      <div class="formula-block"><div class="label">Least squares</div>$$\\min_{x} \\ \\lVert Ax - y \\rVert_2^2.$$</div>
      <p>Expanding, $f(x) = x^\\top (A^\\top A) x - 2 (A^\\top y)^\\top x + \\lVert y \\rVert_2^2$. Since $A^\\top A \\succeq 0$, this is a convex quadratic, so the first-order condition $\\nabla f(x) = 0$ is both necessary and sufficient.</p>

      <h3>The normal equations</h3>
      <p>Setting the gradient to zero gives</p>
      <div class="formula-block"><div class="label">Normal equations</div>$$A^\\top A\\, x = A^\\top y.$$</div>
      <p>These always have at least one solution. If $A$ has full column rank, $A^\\top A$ is invertible and the solution is unique:</p>
      <div class="formula-block">$$x^\\star = (A^\\top A)^{-1} A^\\top y = A^\\dagger y,$$</div>
      <p>where $A^\\dagger$ is the Moore-Penrose pseudoinverse. If $A$ is rank-deficient, the solution set is $x^\\star = A^\\dagger y + \\mathcal{N}(A)$, and $A^\\dagger y$ is the minimum-norm solution.</p>

      <h3>The projection picture</h3>
      <p>Geometrically, $A x^\\star$ is the point of $R(A)$ closest to $y$ &mdash; the orthogonal projection of $y$ onto the range of $A$. The residual $y - A x^\\star$ is orthogonal to $R(A)$, which is exactly what $A^\\top(y - Ax^\\star) = 0$ says. The normal equations and the projection theorem are the same statement.</p>

      <h3>Regularized variants</h3>
      <p>Two regularized versions reappear later as a QP and an LP:</p>
      <ul>
        <li><strong>Ridge / Tikhonov:</strong> $\\min \\lVert Ax - y \\rVert_2^2 + \\lambda \\lVert x \\rVert_2^2$ stays a convex quadratic, solved by $(A^\\top A + \\lambda I)x = A^\\top y$.</li>
        <li><strong>LASSO:</strong> $\\min \\lVert Ax - y \\rVert_2^2 + \\lambda \\lVert x \\rVert_1$ uses the $\\ell_1$ norm as a proxy for sparsity; it reformulates as a QP with slack variables.</li>
      </ul>

      <div class="key-box">
        <div class="label">For the exam</div>
        <ul>
          <li>KKT for $\\min \\tfrac12 \\lVert x \\rVert_2^2$ s.t. $Ax = b$ gives $x^\\star = A^\\top(AA^\\top)^{-1}b$ &mdash; the minimum-norm solution.</li>
          <li>"Normal equations" always means $A^\\top A x = A^\\top y$. Do not confuse with the regularized system.</li>
          <li>Least squares is unconstrained and convex, so $\\nabla f = 0$ is the whole story.</li>
        </ul>
      </div>
    `
  },

  convexity: {
    title: 'Convex sets & convex functions',
    lead: 'Two definitions, and the trap that sits between them. A convex set contains its chords; a convex function lies below its chords. Most exam confusion lives in not keeping these apart.',
    body: `
      <div class="diagram-wrap">
        <svg viewBox="0 0 640 220" xmlns="http://www.w3.org/2000/svg">
          <circle cx="120" cy="110" r="70" fill="#a8431e" fill-opacity="0.12" stroke="#a8431e" stroke-width="2"/>
          <circle cx="85" cy="90" r="4" fill="#1a1612"/>
          <circle cx="155" cy="135" r="4" fill="#1a1612"/>
          <line x1="85" y1="90" x2="155" y2="135" stroke="#4a6b3a" stroke-width="2.5"/>
          <text x="120" y="205" font-size="13" fill="#1a1612" text-anchor="middle" font-family="'Fraunces',serif">Convex: chord stays inside</text>
          <path d="M 360 50 Q 460 110 360 170 Q 500 170 500 110 Q 500 50 360 50 Z" fill="#a13a2e" fill-opacity="0.12" stroke="#a13a2e" stroke-width="2"/>
          <circle cx="372" cy="65" r="4" fill="#1a1612"/>
          <circle cx="372" cy="158" r="4" fill="#1a1612"/>
          <line x1="372" y1="65" x2="372" y2="158" stroke="#a13a2e" stroke-width="2.5" stroke-dasharray="5,4"/>
          <text x="430" y="205" font-size="13" fill="#1a1612" text-anchor="middle" font-family="'Fraunces',serif">Non-convex: chord exits</text>
        </svg>
        <div class="diagram-caption">A set is convex when the line segment between any two of its points stays inside the set.</div>
      </div>

      <h3>Convex sets</h3>
      <p>A set $C \\subseteq \\mathbb{R}^n$ is <strong>convex</strong> if it contains the line segment between any two of its points:</p>
      <div class="formula-block"><div class="label">Definition &mdash; convex set</div>$$x_1, x_2 \\in C, \\ \\lambda \\in [0,1] \\ \\Rightarrow \\ \\lambda x_1 + (1-\\lambda) x_2 \\in C.$$</div>
      <p>Subspaces, affine sets, half-spaces, and norm balls are convex. A <strong>cone</strong> is closed under nonnegative scaling; a <strong>convex cone</strong> is a cone that is also convex. Operations that preserve convexity: <strong>intersection</strong> (even of infinitely many convex sets), and the image or preimage under an <strong>affine map</strong>. The intersection of $m$ half-spaces is a polyhedron &mdash; that is the LP feasible set.</p>

      <h3>Convex functions</h3>
      <p>A function $f$ with convex domain is <strong>convex</strong> if it lies below its chords:</p>
      <div class="formula-block"><div class="label">Definition &mdash; convex function</div>$$f(\\lambda x + (1-\\lambda) y) \\leq \\lambda f(x) + (1-\\lambda) f(y), \\quad \\forall x, y \\in \\mathrm{dom}\\,f, \\ \\lambda \\in [0,1].$$</div>
      <p>$f$ is <strong>strictly convex</strong> if the inequality is strict for $x \\neq y$, and <strong>strongly convex</strong> with parameter $m > 0$ if $f - \\tfrac{m}{2}\\lVert x \\rVert_2^2$ is still convex. Strong convexity implies strict convexity implies convexity.</p>

      <h3>Epigraph and sublevel sets</h3>
      <p>The link between the two definitions: $f$ is convex <strong>if and only if its epigraph</strong> $\\{(x,t): f(x) \\leq t\\}$ <strong>is a convex set</strong>. If $f$ is convex, every sublevel set $\\{x : f(x) \\leq \\alpha\\}$ is convex.</p>
      <div class="key-box">
        <div class="label">The trap</div>
        <p>The converse is false. A function can have convex sublevel sets without being convex &mdash; $\\log x$ is concave, but its sublevel sets are intervals. Functions with all sublevel sets convex are called <strong>quasiconvex</strong>. So "the set $\\{x : f(x) \\leq t\\}$ is convex" does not let you conclude $f$ is convex.</p>
      </div>

      <h3>Operations that preserve convexity</h3>
      <ul>
        <li><strong>Nonnegative combinations:</strong> $\\sum \\alpha_i f_i$ with $\\alpha_i \\geq 0$ is convex if each $f_i$ is.</li>
        <li><strong>Affine substitution:</strong> $f(Ax + b)$ is convex if $f$ is.</li>
        <li><strong>Pointwise maximum:</strong> $\\max_\\alpha f_\\alpha(x)$ is convex if each $f_\\alpha$ is. (Pointwise <em>minimum</em> is not.)</li>
        <li><strong>Composition:</strong> $h \\circ g$ is convex if $h$ is convex and nondecreasing and $g$ is convex; or $h$ convex nonincreasing and $g$ concave.</li>
        <li><strong>Restriction to a line:</strong> $f$ is convex iff $g(t) = f(x_0 + tv)$ is convex for every line. A powerful proof tool.</li>
      </ul>

      <h3>First- and second-order conditions</h3>
      <p>For differentiable $f$: convex iff the graph lies above every tangent,</p>
      <div class="formula-block">$$f(y) \\geq f(x) + \\nabla f(x)^\\top (y - x), \\quad \\forall x, y.$$</div>
      <p>For twice-differentiable $f$: convex iff $\\nabla^2 f(x) \\succeq 0$ everywhere; $\\nabla^2 f \\succ 0$ everywhere implies strict convexity (but not conversely &mdash; take $x^4$). For the quadratic $\\tfrac12 x^\\top H x + c^\\top x + d$, this just says $H \\succeq 0$.</p>
    `
  },

  cvxprob: {
    title: 'Convex problems & optimality',
    lead: 'A convex problem is a convex objective minimized over a convex set. The payoff is enormous: local optima are global. The optimality conditions differ by constraint type, and that is the part to keep straight.',
    body: `
      <h3>Standard form</h3>
      <p>A problem is a <strong>convex optimization problem</strong> when</p>
      <div class="formula-block"><div class="label">Convex standard form</div>$$\\begin{aligned} p^\\star = \\min_{x} \\ & f_0(x) \\\\ \\text{s.t. } & f_i(x) \\leq 0, \\ i = 1,\\dots,m \\\\ & h_i(x) = 0, \\ i = 1,\\dots,q \\end{aligned}$$</div>
      <p>with $f_0$ convex, the inequality functions $f_i$ convex, and the equality functions $h_i$ <strong>affine</strong>. The equality constraints are usually written $Ax = b$. The feasible set $X$ is then an intersection of convex sublevel sets and flats, hence convex.</p>
      <p>Vocabulary worth being precise about: a problem is <strong>infeasible</strong> if $X = \\emptyset$ (set $p^\\star = +\\infty$), <strong>unbounded below</strong> if $p^\\star = -\\infty$, and an inequality constraint is <strong>active</strong> at $x^\\star$ when $f_i(x^\\star) = 0$, <strong>inactive (slack)</strong> when $f_i(x^\\star) < 0$.</p>

      <h3>Local equals global</h3>
      <div class="key-box">
        <div class="label">The reason convexity matters</div>
        <p>If $f_0$ is convex and $X$ is convex, then <strong>any locally optimal point is globally optimal</strong>, and the optimal set is itself convex. This is why convex problems are "nice" &mdash; a solver that finds a local minimum has found the answer.</p>
      </div>

      <h3>Problem transformations</h3>
      <p>Equivalent reformulations are a recurring exam tool. The most useful:</p>
      <ul>
        <li><strong>Monotone objective transform:</strong> replacing $f_0$ by $\\varphi(f_0)$ with $\\varphi$ strictly increasing keeps the same minimizers.</li>
        <li><strong>Slack variables:</strong> a sum objective $\\sum \\varphi_i(x)$ becomes $\\min \\sum t_i$ s.t. $\\varphi_i(x) \\leq t_i$.</li>
        <li><strong>Epigraph form:</strong> any convex problem can be rewritten with a <em>linear</em> objective: $\\min t$ s.t. $f_0(x) \\leq t$ and the original constraints.</li>
        <li><strong>Equality to inequality:</strong> under suitable monotonicity, $h(x) = 0$ can be relaxed to $h(x) \\leq 0$ to gain convexity.</li>
      </ul>

      <h3>Optimality conditions</h3>
      <p>The general first-order condition for a convex problem over a convex set $X$:</p>
      <div class="formula-block"><div class="label">First-order optimality</div>$$x \\text{ optimal} \\ \\Longleftrightarrow \\ \\nabla f_0(x)^\\top (y - x) \\geq 0, \\quad \\forall y \\in X.$$</div>
      <p>In words: there is no feasible direction along which the objective decreases. The three special cases:</p>
      <table class="calc-table">
        <tr><th>Problem type</th><th>Optimality condition at $x$</th></tr>
        <tr><td>Unconstrained ($X = \\mathbb{R}^n$)</td><td>$\\nabla f_0(x) = 0$</td></tr>
        <tr><td>Equality-constrained ($Ax = b$)</td><td>$Ax = b$ and $\\nabla f_0(x) + A^\\top \\nu = 0$ for some $\\nu$</td></tr>
        <tr><td>Inequality-constrained</td><td>$\\nabla f_0(x) + \\sum_{i \\in A(x)} \\lambda_i \\nabla f_i(x) = 0$, $\\lambda_i \\geq 0$ over active constraints</td></tr>
      </table>
      <p>The inequality case is the KKT stationarity condition restricted to the active set. The full KKT system is covered under duality.</p>
    `
  },

  lp: {
    title: 'Linear programming',
    lead: 'Linear objective, polyhedral feasible set. The smallest of the standard forms, and the one whose reformulations get confused most often on this course.',
    body: `
      <h3>The LP</h3>
      <p>A linear program minimizes a linear objective over a polyhedron:</p>
      <div class="formula-block"><div class="label">LP &mdash; inequality form</div>$$\\min_{x} \\ c^\\top x \\quad \\text{s.t. } Ax \\leq b, \\ A_{eq} x = b_{eq}.$$</div>
      <p>It is the special case of a QP with $H = 0$. A collection of linear inequalities $a_i^\\top x \\leq b_i$ defines a <strong>polyhedron</strong>; if bounded, a <strong>polytope</strong>. Familiar polytopes: the probability simplex $\\{x \\geq 0, \\sum x_i = 1\\}$ and the $\\ell_1$-norm ball $\\{\\lVert x \\rVert_1 \\leq 1\\}$.</p>

      <h3>Standard form</h3>
      <p>The <strong>standard form</strong> used by algorithms is</p>
      <div class="formula-block">$$\\min \\ \\tilde{c}^\\top \\tilde{x} \\quad \\text{s.t. } \\tilde{A}\\tilde{x} = \\tilde{b}, \\ \\tilde{x} \\geq 0.$$</div>
      <p>Any inequality-form LP converts to standard form by splitting $x = x^+ - x^-$ with $x^\\pm \\geq 0$ and adding a slack vector $e \\geq 0$ so that $Ax + e = b$.</p>

      <h3>How LPs are solved</h3>
      <p>The classical method is the <strong>simplex algorithm</strong>, which walks the vertices of the feasible polyhedron. It works extremely well in practice but has exponential worst-case complexity. Karmarkar's 1984 <strong>interior-point method</strong> solves LPs in polynomial worst-case time. Modern solvers (Gurobi, CPLEX, Xpress) use up-to-date versions of both and handle problems with up to $10^8$ variables.</p>

      <div class="key-box">
        <div class="label">The most-confused pair on this course</div>
        <p>Two $\\ell_\\infty$ / $\\ell_1$ reformulations look alike but differ in the dimension of the slack variable:</p>
        <ul>
          <li><strong>Chebyshev approximation:</strong> $\\min \\lVert Ax - b \\rVert_\\infty$ becomes $\\min t$ s.t. $-t\\mathbf{1} \\leq Ax - b \\leq t\\mathbf{1}$. <em>One scalar</em> $t$.</li>
          <li><strong>$\\ell_1$ minimization:</strong> $\\min \\lVert Ax - b \\rVert_1$ becomes $\\min \\mathbf{1}^\\top t$ s.t. $-t \\leq Ax - b \\leq t$. <em>A vector</em> $t$ with $m$ components.</li>
        </ul>
        <p>The dimension of the slack tells you which one it is.</p>
      </div>

      <h3>Worked examples from the course</h3>
      <p>LPs show up as the diet problem (minimize cost subject to nutritional lower bounds), max-flow on a network (flow conservation at interior nodes, capacity bounds on edges), and thruster force allocation (minimize fuel subject to desired net force and torque). The $\\ell_1$-regularized $\\ell_1$-regression problem $\\min \\lVert Ax - y \\rVert_1 + \\gamma \\lVert x \\rVert_1$ is also an LP, and its residuals come out sparse &mdash; qualitatively different from the spread-out residuals of ordinary least squares.</p>
    `
  },

  qp: {
    title: 'Quadratic programming',
    lead: 'Quadratic objective, linear constraints. The convexity of the whole problem rides entirely on the sign of the Hessian.',
    body: `
      <h3>Quadratic functions</h3>
      <p>A quadratic function is $f_0(x) = \\tfrac12 x^\\top H x + c^\\top x + d$ with $H$ symmetric. Its shape is dictated by the eigenvalues of $H$:</p>
      <table class="calc-table">
        <tr><th>Hessian $H$</th><th>$f_0$ is</th><th>Shape</th></tr>
        <tr><td>$H \\succ 0$ (all $\\lambda_i > 0$)</td><td>strongly convex</td><td>elliptic paraboloid, unique minimizer</td></tr>
        <tr><td>$H \\succeq 0$ (all $\\lambda_i \\geq 0$)</td><td>convex</td><td>convex paraboloid, possibly a flat valley</td></tr>
        <tr><td>$H \\preceq 0$</td><td>concave</td><td>concave paraboloid</td></tr>
        <tr><td>$H$ indefinite</td><td>neither</td><td>hyperbolic paraboloid (saddle)</td></tr>
      </table>

      <h3>Standard form of a QP</h3>
      <div class="formula-block"><div class="label">QP standard form</div>$$\\min_{x} \\ \\tfrac12 x^\\top H x + c^\\top x + d \\quad \\text{s.t. } Ax \\leq b, \\ Fx = g.$$</div>
      <p>The objective is quadratic, the constraints are linear (a polyhedron). The decisive condition: <strong>if $H \\succeq 0$ the QP is convex and efficiently solvable; if $H \\not\\succeq 0$ it is generally intractable.</strong> This course deals with the convex case.</p>

      <h3>Unconstrained minimization</h3>
      <p>For the unconstrained quadratic, the minimizer solves $Hx = -c$:</p>
      <ul>
        <li>If $H$ has a negative eigenvalue, $f_0$ is unbounded below: $p^\\star = -\\infty$.</li>
        <li>If $H \\succeq 0$ and $c \\in R(H)$, then $p^\\star = -\\tfrac12 c^\\top H^\\dagger c + d$, attained on $x^\\star = -H^\\dagger c + \\mathcal{N}(H)$.</li>
        <li>If $H \\succ 0$, the minimizer is unique: $x^\\star = -H^{-1}c$, with $p^\\star = -\\tfrac12 c^\\top H^{-1}c + d$.</li>
      </ul>

      <h3>QPs in the wild</h3>
      <p><strong>The Markowitz model.</strong> With expected returns $\\hat{r}$ and covariance $\\Sigma \\succeq 0$, the risk-return tradeoff is</p>
      <div class="formula-block">$$\\min_{x} \\ x^\\top \\Sigma x - \\gamma\\, \\hat{r}^\\top x \\quad \\text{s.t. } x \\geq 0, \\ \\mathbf{1}^\\top x = 1.$$</div>
      <p>Since $\\Sigma \\succeq 0$ this is a convex QP. Sweeping $\\gamma \\geq 0$ traces the efficient frontier of return vs risk.</p>
      <p><strong>The LASSO.</strong> $\\min \\lVert Ax - y \\rVert_2^2 + \\lambda \\lVert x \\rVert_1$ casts as a QP by introducing $u$ with $-u \\leq x \\leq u$ and minimizing $\\lVert Ax - y \\rVert_2^2 + \\lambda \\mathbf{1}^\\top u$.</p>

      <div class="key-box">
        <div class="label">The one-line tell</div>
        <p>Quadratic objective, linear constraints, $H \\succeq 0$. If the constraints are also quadratic you have a QCQP, not a QP. Containment: every LP is a QP (take $H = 0$).</p>
      </div>
    `
  },

  socp: {
    title: 'Second-order cone programs',
    lead: 'Linear objective, "norm leq affine" constraints. SOCP is the form that swallows LP and QP, and its giveaway constraint is unmistakable once you have seen it.',
    body: `
      <div class="diagram-wrap">
        <svg viewBox="0 0 420 220" xmlns="http://www.w3.org/2000/svg">
          <path d="M 210 30 L 320 190 L 100 190 Z" fill="#a8431e" fill-opacity="0.12" stroke="#a8431e" stroke-width="2"/>
          <ellipse cx="210" cy="190" rx="110" ry="22" fill="#a8431e" fill-opacity="0.18" stroke="#a8431e" stroke-width="2"/>
          <line x1="210" y1="30" x2="210" y2="200" stroke="#4a4239" stroke-width="1.5" stroke-dasharray="4,3"/>
          <text x="225" y="120" font-size="13" fill="#4a4239" font-family="'JetBrains Mono',monospace">u</text>
          <text x="300" y="180" font-size="13" fill="#4a4239" font-family="'JetBrains Mono',monospace">z</text>
          <text x="210" y="215" font-size="13" fill="#1a1612" text-anchor="middle" font-family="'Fraunces',serif">The cone: || z ||&#8322; &#8804; u</text>
        </svg>
        <div class="diagram-caption">The second-order ("ice-cream") cone in R&#8319;: the set of (z, u) with the Euclidean norm of z bounded by u.</div>
      </div>

      <h3>The second-order cone</h3>
      <p>The second-order cone, or ice-cream cone, in $\\mathbb{R}^n$ is</p>
      <div class="formula-block"><div class="label">Second-order cone</div>$$K_n = \\{ (z, u) : z \\in \\mathbb{R}^{n-1}, \\ u \\in \\mathbb{R}, \\ \\lVert z \\rVert_2 \\leq u \\}.$$</div>
      <p>It is a convex cone, and the intersection of convex cones is a convex cone.</p>

      <h3>The standard SOC constraint</h3>
      <p>The constraint you must learn to recognize on sight is</p>
      <div class="formula-block"><div class="label">SOC constraint &mdash; the giveaway</div>$$\\lVert A x + b \\rVert_2 \\leq c^\\top x + d.$$</div>
      <p>A norm bounded by an affine function. Squaring both sides gives $\\lVert Ax + b \\rVert_2^2 \\leq (c^\\top x + d)^2$ plus $c^\\top x + d \\geq 0$ &mdash; but the squared inequality alone need not be convex, since its Hessian $A^\\top A - cc^\\top$ may be indefinite. The norm-form is always convex; that is why you keep it as a norm.</p>

      <h3>An SOCP</h3>
      <p>A second-order cone program has a linear objective and SOC constraints:</p>
      <div class="formula-block">$$\\min_{x} \\ c^\\top x \\quad \\text{s.t. } \\lVert A_i x + b_i \\rVert_2 \\leq c_i^\\top x + d_i, \\ i = 1, \\dots, m.$$</div>

      <h3>LP and QP sit inside SOCP</h3>
      <p>An LP constraint $a_i^\\top x \\leq b_i$ is an SOC constraint with zero left side: $\\lVert 0 \\rVert_2 \\leq b_i - a_i^\\top x$. A convex QP also casts as an SOCP by writing $x^\\top Q x \\leq y$ as a rotated-cone constraint. The containment is</p>
      <div class="formula-block">$$\\text{LP} \\subset \\text{QP} \\subset \\text{SOCP} \\subset \\text{SDP}.$$</div>
      <p>So if a question asks "is this an SOCP?" and you have shown it is an LP, the answer is yes &mdash; though the <em>tightest</em> class is LP.</p>

      <h3>Where SOCPs come from</h3>
      <p>Sums and maxima of norms: $\\min \\sum_i \\lVert A_i x - b_i \\rVert_2$ and $\\min \\max_i \\lVert A_i x - b_i \\rVert_2$ both cast as SOCPs with auxiliary scalars. The Fermat-Weber facility location problem is the sum-of-norms case. <strong>Chance-constrained LPs</strong> are the headline application: if the data $a_i$ are Gaussian, a probabilistic constraint $\\mathrm{Prob}\\{a_i^\\top x \\leq b_i\\} \\geq p_i$ with $p_i > 0.5$ is equivalent to the SOC constraint $\\bar{a}_i^\\top x \\leq b_i - \\Phi^{-1}(p_i) \\lVert \\Sigma_i^{1/2} x \\rVert_2$.</p>
    `
  },

  gp: {
    title: 'Geometric programming',
    lead: 'GPs handle positive variables that appear as products and powers. They are not convex as written, but a log-substitution makes them convex. The recognition test is whether everything is a posynomial.',
    body: `
      <h3>Monomials and posynomials</h3>
      <p>For $x > 0$, a <strong>positive monomial</strong> is $c\\, x_1^{a_1} x_2^{a_2} \\cdots x_n^{a_n}$ with $c > 0$ and any real exponents $a_i$. A <strong>posynomial</strong> is a sum of positive monomials:</p>
      <div class="formula-block"><div class="label">Posynomial</div>$$f(x) = \\sum_{i=1}^{K} c_i\\, x_1^{a_{i1}} \\cdots x_n^{a_{in}}, \\qquad c_i > 0, \\ x > 0.$$</div>
      <div class="key-box">
        <div class="label">The recognition test</div>
        <p>Coefficients must be <strong>positive</strong>; variables must be <strong>positive</strong>; exponents can be <strong>any real number</strong>, including negative or fractional. A single minus sign on a coefficient breaks the posynomial structure. So $2x + 3y$ and $x^{-1} + y$ are posynomials; $-x + y$ is not.</p>
      </div>

      <h3>The standard form of a GP</h3>
      <div class="formula-block"><div class="label">GP standard form</div>$$\\min \\ f_0(x) \\quad \\text{s.t. } f_i(x) \\leq 1, \\ h_i(x) = 1,$$</div>
      <p>where $f_0, \\dots, f_m$ are (generalized) posynomials and the equality functions $h_i$ are monomials. Note the constraints are "$\\leq 1$" and "$= 1$", not "$\\leq 0$".</p>

      <h3>Why a GP is secretly convex</h3>
      <p>A posynomial is not convex on its own. But take the log-substitution $y_i = \\ln x_i$. A monomial $c x^a$ becomes $e^{a^\\top y + b}$ with $b = \\ln c$ &mdash; convex. A posynomial becomes a sum of exponentials, still convex. Taking the log of the whole thing turns it into the <strong>log-sum-exp</strong> function $\\mathrm{lse}(Ay + b)$, which is convex. So:</p>
      <div class="formula-block">$$x_i = e^{y_i} \\ \\Longrightarrow \\ \\text{GP becomes } \\min \\ \\mathrm{lse}(A_0 y + b_0) \\ \\text{ s.t. } \\mathrm{lse}(A_i y + b_i) \\leq 0, \\ Ry + h = 0.$$</div>
      <p>This is a convex problem, solved reliably by standard methods. A modeling parser (CVX) does the substitution automatically.</p>

      <h3>Generalized posynomials</h3>
      <p>Generalized posynomials are built from posynomials using addition, multiplication, pointwise maximum, and raising to a positive power. Fractional powers and maxima are handled with the same slack-variable trick: $f_1(x)^{2.2} + f_2(x)^{3.1} \\leq 1$ becomes $t_1^{2.2} + t_2^{3.1} \\leq 1$ with $f_1 \\leq t_1$, $f_2 \\leq t_2$; and $\\max(f_1, f_2) + f_3 \\leq 1$ becomes $t + f_3 \\leq 1$ with $f_1 \\leq t$, $f_2 \\leq t$.</p>

      <h3>The canonical example</h3>
      <p>The cylindrical storage tank: minimize $c_1 h^{-1} d^{-2} + c_2 d^2 + c_3 dh$ over the diameter $d$ and height $h$, subject to box bounds and an aspect-ratio cap $h \\leq \\kappa_{\\max} d$. The objective is a posynomial; every constraint rewrites as "monomial $\\leq 1$". A GP.</p>
    `
  },

  duality: {
    title: 'Lagrangian duality & KKT',
    lead: 'Duality builds a lower bound on the primal optimum out of the constraints. Strong duality says the bound is tight for convex problems. KKT collects optimality into four conditions. Keep "Lagrangian" and "KKT" apart: one is a function, the other is a system.',
    body: `
      <h3>The Lagrangian</h3>
      <p>For a primal problem in standard form, the <strong>Lagrangian</strong> attaches a multiplier to every constraint:</p>
      <div class="formula-block"><div class="label">Lagrangian</div>$$L(x, \\lambda, \\nu) = f_0(x) + \\sum_{i=1}^{m} \\lambda_i f_i(x) + \\sum_{i=1}^{q} \\nu_i h_i(x), \\qquad \\lambda \\geq 0.$$</div>
      <p>The $\\lambda$ are the inequality multipliers, the $\\nu$ the equality multipliers, jointly the <strong>dual variables</strong>. No convexity is assumed yet. The Lagrangian is just a function &mdash; it is notation, not a condition.</p>

      <h3>The dual function and the dual problem</h3>
      <p>Minimizing the Lagrangian over $x$ gives the <strong>dual function</strong> $g(\\lambda, \\nu) = \\inf_x L(x, \\lambda, \\nu)$. It is <strong>always concave</strong> (a pointwise infimum of affine functions), regardless of whether the primal is convex. Its key property:</p>
      <div class="formula-block"><div class="label">Lower bound property</div>$$g(\\lambda, \\nu) \\leq p^\\star \\quad \\text{for all } \\lambda \\geq 0, \\ \\nu.$$</div>
      <p>Maximizing this lower bound is the <strong>dual problem</strong> $d^\\star = \\max_{\\lambda \\geq 0, \\nu} g(\\lambda, \\nu)$, which is always a convex problem.</p>

      <h3>Weak and strong duality</h3>
      <ul>
        <li><strong>Weak duality:</strong> $d^\\star \\leq p^\\star$, always. The gap $p^\\star - d^\\star$ is the duality gap.</li>
        <li><strong>Strong duality:</strong> $d^\\star = p^\\star$. Holds for convex problems under a constraint qualification &mdash; <strong>Slater's condition</strong>: there exists a strictly feasible point ($f_i(x) < 0$ for the non-affine inequalities). For LP, strong duality holds whenever the primal is feasible.</li>
      </ul>

      <h3>The KKT conditions</h3>
      <p>For a generic problem the <strong>KKT conditions</strong> characterize optimality. They are four things, and naming all four is a standard exam ask:</p>
      <div class="formula-block"><div class="label">KKT</div>$$\\begin{aligned} &\\text{1. Stationarity: } && \\nabla_x L(x, \\lambda, \\nu) = 0 \\\\ &\\text{2. Primal feasibility: } && f_i(x) \\leq 0, \\ h_i(x) = 0 \\\\ &\\text{3. Dual feasibility: } && \\lambda \\geq 0 \\\\ &\\text{4. Complementary slackness: } && \\lambda_i f_i(x) = 0 \\end{aligned}$$</div>
      <div class="key-box">
        <div class="label">Lagrangian vs KKT &mdash; do not blur these</div>
        <p>The <strong>Lagrangian</strong> is the single function $L(x, \\lambda, \\nu)$. The <strong>KKT conditions</strong> are the four-part system above. For a convex problem with Slater's condition, KKT is necessary <em>and</em> sufficient for optimality. Without convexity, KKT is only necessary (given a constraint qualification).</p>
      </div>

      <h3>Dual variables as sensitivities</h3>
      <p>Under strong duality, the optimal multiplier $\\lambda_i^\\star$ is the sensitivity of the optimal value to relaxing constraint $i$: if you perturb $f_i(x) \\leq u_i$, then $\\lambda_i^\\star = -\\partial p^\\star / \\partial u_i$. A large multiplier means a tight, expensive constraint.</p>

      <h3>Worked: the dual of an LP</h3>
      <p>For $\\min c^\\top x$ s.t. $Ax \\leq b$, the Lagrangian is $(c + A^\\top \\lambda)^\\top x - \\lambda^\\top b$. It is affine in $x$, so the infimum is $-\\infty$ unless $c + A^\\top \\lambda = 0$. The dual is</p>
      <div class="formula-block">$$d^\\star = \\max_{\\lambda} \\ -b^\\top \\lambda \\quad \\text{s.t. } A^\\top \\lambda + c = 0, \\ \\lambda \\geq 0.$$</div>
      <p>The dual of an LP is an LP. Sign conventions vary between textbooks &mdash; what matters is that you can derive it, not that you memorize one form.</p>
    `
  },

  gradient: {
    title: 'Gradient descent',
    lead: 'The baseline first-order method. Cheap iterations, no Hessian, but convergence can crawl. The two things to know are the stepsize rule and the convergence rate.',
    body: `
      <h3>The update</h3>
      <p>Gradient descent moves along the negative gradient, the steepest descent direction:</p>
      <div class="formula-block"><div class="label">Gradient step</div>$$x_{k+1} = x_k - s_k \\nabla f_0(x_k).$$</div>
      <p>Any $v_k$ with $\\nabla f_0(x_k)^\\top v_k < 0$ is a descent direction; the negative gradient is the best one in the Euclidean norm by Cauchy-Schwarz.</p>

      <h3>Choosing the stepsize</h3>
      <p><strong>Exact line search</strong> picks $s_k = \\arg\\min_{s \\geq 0} f_0(x_k + s v_k)$ &mdash; best possible decrease, but it means solving a univariate problem each step, so it is rarely used. The practical alternative is the <strong>Armijo condition</strong>: accept $s$ if it gives a sufficient fraction of the decrease predicted by the tangent line,</p>
      <div class="formula-block"><div class="label">Armijo / sufficient decrease</div>$$f_0(x_k + s v_k) \\leq f_0(x_k) + s\\, \\alpha\\, \\nabla f_0(x_k)^\\top v_k, \\qquad \\alpha \\in (0,1).$$</div>
      <p><strong>Backtracking</strong> enforces this: start at $s = s_{\\text{init}}$ (usually 1), and while Armijo fails, shrink $s \\leftarrow \\beta s$ with $\\beta \\in (0,1)$. Backtracking guarantees a stepsize bounded below, so the method makes real progress each step without needing to know the Lipschitz constant.</p>

      <h3>The descent lemma</h3>
      <p>The standard assumption is that $\\nabla f_0$ is <strong>Lipschitz continuous</strong> with constant $L$. Then $f_0$ has a quadratic upper bound:</p>
      <div class="formula-block">$$f_0(x) \\leq f_0(y) + \\nabla f_0(y)^\\top (x - y) + \\tfrac{L}{2} \\lVert x - y \\rVert_2^2.$$</div>
      <p>One gradient step is exactly the minimizer of this quadratic upper model &mdash; that is the cleanest way to see where the update comes from. A constant stepsize $s = (1-\\alpha) \\cdot 2/L$ satisfies Armijo, but knowing $L$ is usually avoided by backtracking instead.</p>

      <h3>Convergence rate</h3>
      <table class="calc-table">
        <tr><th>Assumption on $f_0$</th><th>Iterations to reach $f_0(x_k) - f_0^\\star \\leq \\epsilon$</th></tr>
        <tr><td>Smooth, convex</td><td>$O(1/\\epsilon)$ &mdash; sublinear</td></tr>
        <tr><td>Smooth, strongly convex</td><td>$O(\\log(1/\\epsilon))$ &mdash; linear</td></tr>
        <tr><td>Smooth, non-convex</td><td>converges to a stationary point ($\\nabla f_0 = 0$), not necessarily a minimum</td></tr>
      </table>
      <p>On a poorly conditioned quadratic the iterates zig-zag across a narrow valley &mdash; the classic picture of slow gradient descent. The condition number $\\kappa = L/m$ governs the linear rate $(1 - m/L)^k$.</p>

      <div class="key-box">
        <div class="label">Trade-offs</div>
        <ul>
          <li><strong>For:</strong> cheap iterations, no second derivatives, works at large scale.</li>
          <li><strong>Against:</strong> slow on ill-conditioned problems; needs differentiability.</li>
          <li>For convex $f_0$, a stationary point is a global minimum, so the method converges to the answer.</li>
        </ul>
      </div>
    `
  },

  newton: {
    title: "Newton's method",
    lead: 'Newton uses the Hessian to build a better local model. The payoff is quadratic convergence near the optimum; the cost is a linear system solve per step. Affine invariance is the property that sets it apart from gradient descent.',
    body: `
      <div class="diagram-wrap">
        <svg viewBox="0 0 560 200" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="150" cy="100" rx="120" ry="40" fill="none" stroke="#c9bfaa" stroke-width="1.5"/>
          <ellipse cx="150" cy="100" rx="80" ry="26" fill="none" stroke="#c9bfaa" stroke-width="1.5"/>
          <ellipse cx="150" cy="100" rx="40" ry="13" fill="none" stroke="#c9bfaa" stroke-width="1.5"/>
          <polyline points="40,60 90,135 120,75 145,118 150,98" fill="none" stroke="#a8431e" stroke-width="2.5"/>
          <text x="150" y="180" font-size="12" fill="#1a1612" text-anchor="middle" font-family="'Fraunces',serif">Gradient: zig-zags</text>
          <ellipse cx="420" cy="100" rx="120" ry="40" fill="none" stroke="#c9bfaa" stroke-width="1.5"/>
          <ellipse cx="420" cy="100" rx="80" ry="26" fill="none" stroke="#c9bfaa" stroke-width="1.5"/>
          <ellipse cx="420" cy="100" rx="40" ry="13" fill="none" stroke="#c9bfaa" stroke-width="1.5"/>
          <polyline points="310,62 380,108 420,100" fill="none" stroke="#4a6b3a" stroke-width="2.5"/>
          <text x="420" y="180" font-size="12" fill="#1a1612" text-anchor="middle" font-family="'Fraunces',serif">Newton: cuts across</text>
        </svg>
        <div class="diagram-caption">Gradient descent follows local steepness and zig-zags on ill-conditioned problems; Newton rescales by the Hessian and heads more directly toward the minimum.</div>
      </div>

      <h3>The Newton step</h3>
      <p>Gradient descent minimizes a quadratic model with a fixed $\\tfrac{1}{2t}\\lVert \\cdot \\rVert^2$ curvature term. Newton uses the <em>actual</em> curvature, the Hessian:</p>
      <div class="formula-block"><div class="label">Newton model</div>$$f_0(x) \\approx f_0(x_k) + \\nabla f_0(x_k)^\\top (x - x_k) + \\tfrac12 (x - x_k)^\\top \\nabla^2 f_0(x_k)(x - x_k).$$</div>
      <p>Minimizing this model gives the pure Newton update:</p>
      <div class="formula-block"><div class="label">Pure Newton step</div>$$x_{k+1} = x_k - \\nabla^2 f_0(x_k)^{-1} \\nabla f_0(x_k).$$</div>

      <h3>Affine invariance</h3>
      <p>Newton's method is <strong>affine invariant</strong>: if you change variables $x = Ay$ with $A$ nonsingular, the Newton iterates are related by the same change of variables. Progress does not depend on how the problem is scaled or stretched. Gradient descent does not have this property &mdash; it is sensitive to conditioning, which is exactly why it zig-zags.</p>

      <h3>The Newton decrement</h3>
      <p>The <strong>Newton decrement</strong> measures how close you are to the optimum:</p>
      <div class="formula-block">$$\\lambda(x) = \\left( \\nabla f_0(x)^\\top \\nabla^2 f_0(x)^{-1} \\nabla f_0(x) \\right)^{1/2}.$$</div>
      <p>The quantity $\\tfrac12 \\lambda(x)^2$ is an estimate of the suboptimality gap $f_0(x) - f_0^\\star$, so it is the natural stopping criterion. It is also the length of the Newton step in the norm defined by the Hessian, and like the step itself it is affine invariant.</p>

      <h3>Damped Newton</h3>
      <p>The pure step can overshoot, so the <strong>damped Newton method</strong> takes $x_{k+1} = x_k + t v$ with $v = -\\nabla^2 f_0(x_k)^{-1}\\nabla f_0(x_k)$ and $t$ from backtracking line search. The Newton direction is always a descent direction, since $\\nabla f_0^\\top v = -\\lambda^2 < 0$.</p>

      <h3>Convergence: two phases</h3>
      <p>Assuming strong convexity and a Lipschitz Hessian, convergence happens in two stages:</p>
      <ul>
        <li><strong>Damped phase:</strong> while the gradient is large, each step decreases $f_0$ by at least a constant $\\gamma$.</li>
        <li><strong>Pure phase:</strong> once the gradient is small, $t = 1$ is always accepted and convergence is <strong>quadratic</strong> &mdash; the error roughly squares each step.</li>
      </ul>
      <p>Quadratic convergence is the headline. Compare gradient descent, which manages only linear convergence even under strong convexity. The total iteration count is essentially $(f_0(x_0) - f_0^\\star)/\\gamma + \\log\\log(1/\\epsilon)$.</p>

      <div class="key-box">
        <div class="label">Gradient vs Newton &mdash; which one when</div>
        <p>If the Hessian is cheap to form and solve, use Newton: quadratic convergence, affine invariant. If you can only afford gradients, use gradient descent (or an accelerated variant). The trade is per-iteration cost &mdash; Newton solves a linear system each step &mdash; against iteration count.</p>
      </div>
    `
  },

  constrained: {
    title: 'Constrained optimization',
    lead: 'Constrained problems are harder because the optimum need not be a stationary point of the objective. Two routes: project the gradient step back onto a simple feasible set, or push the constraints into the objective with a barrier.',
    body: `
      <h3>Why constraints change the game</h3>
      <p>In unconstrained minimization the optima are the stationary points, $\\nabla f_0(x) = 0$. With constraints this fails &mdash; the solution must be feasible, and it often sits on the boundary where $\\nabla f_0 \\neq 0$. Just running a descent method does not work; the structure of the constraints has to be respected.</p>

      <h3>Projected gradient on simple sets</h3>
      <p>For a problem $\\min f_0(x)$ s.t. $x \\in X$ with $X$ convex and "simple", the <strong>projected gradient algorithm</strong> alternates a gradient step with a projection back onto $X$:</p>
      <div class="formula-block"><div class="label">Projected gradient</div>$$x_{k+1} = P_X\\big( x_k - s_k \\nabla f_0(x_k) \\big).$$</div>
      <p>"Simple" means the Euclidean projection $P_X(x) = \\arg\\min_{z \\in X}\\lVert x - z \\rVert_2$ is cheap. Closed-form projections exist for:</p>
      <table class="calc-table">
        <tr><th>Set $X$</th><th>Projection $P_X(x)$</th></tr>
        <tr><td>Box $\\{x^{low} \\leq x \\leq x^{up}\\}$</td><td>clamp each coordinate to its bounds</td></tr>
        <tr><td>$\\ell_2$ ball $\\{\\lVert x \\rVert_2 \\leq 1\\}$</td><td>$x$ if inside, else $x / \\lVert x \\rVert_2$</td></tr>
        <tr><td>Probability simplex</td><td>fast $O(n)$ algorithm</td></tr>
      </table>
      <p>The projected method has the same complexity as the unconstrained one: $O(1/\\epsilon)$ for smooth convex $f_0$, $O(\\log(1/\\epsilon))$ for strongly convex.</p>

      <h3>The log-barrier</h3>
      <p>For general convex problems with inequality constraints, the <strong>barrier method</strong> pushes the constraints into the objective. The exact indicator $I_-(u)$ (zero if $u \\leq 0$, $+\\infty$ otherwise) is non-differentiable, so it is approximated by the smooth <strong>logarithmic barrier</strong>:</p>
      <div class="formula-block"><div class="label">Log-barrier</div>$$\\phi(x) = -\\sum_{i=1}^{m} \\log(-f_i(x)).$$</div>
      <p>This gives a family of smooth equality-constrained problems $\\min\\ t f_0(x) + \\phi(x)$ s.t. $Ax = b$, one for each $t > 0$.</p>

      <h3>The central path</h3>
      <p>The minimizer $x^\\star(t)$ of the barrier-penalized problem traces the <strong>central path</strong> as $t$ varies. Because the barrier blows up at the boundary, $x^\\star(t)$ is always strictly feasible. As $t \\to \\infty$, $x^\\star(t) \\to x^\\star$, the true optimum &mdash; and $x^\\star(t)$ is $m/t$-suboptimal, which is the stopping rule.</p>

      <h3>The barrier method</h3>
      <p>You do not solve once with a huge $t$. Start at a small $t_0$, solve for $x^\\star(t_0)$ with Newton's method, then increase $t \\leftarrow \\mu t$ for some $\\mu > 1$ and re-solve, warm-started from the previous point. Repeat until $m/t \\leq \\epsilon$. Each re-solve is a "centering step". The whole thing converges in roughly $\\log(m/(t_0 \\epsilon)) / \\log \\mu$ centering iterations.</p>

      <h3>Phase 1</h3>
      <p>The barrier method needs a strictly feasible starting point. <strong>Phase 1</strong> finds one (or proves none exists) by solving an auxiliary problem: $\\min s$ s.t. $f_i(x) \\leq s$, $Ax = b$. If the optimal $\\tilde{s} < 0$, the minimizer is strictly feasible for the original problem. If $\\tilde{s} > 0$, the original problem is infeasible.</p>

      <div class="key-box">
        <div class="label">Recognizing the right tool</div>
        <ul>
          <li>Feasible set is a box, ball, or simplex &mdash; projected gradient.</li>
          <li>General convex inequalities, smooth functions &mdash; log-barrier / interior-point.</li>
          <li>The barrier method is built on top of Newton's method, run once per value of $t$ along the central path.</li>
        </ul>
      </div>
    `
  },
};

// =================== QUIZ DATA ===================
const QUIZ = [
  // LINALG
  { topic: 'linalg', type: 'mc', q: 'What is the gradient of $f(x) = \\frac{1}{2} x^\\top H x + c^\\top x + d$ with $H$ symmetric?',
    options: ['$Hx$', '$Hx + c$', '$\\frac{1}{2}Hx + c$', '$H + c$'], a: 1,
    expl: 'Differentiating the quadratic form gives $\\nabla f = Hx + c$. The Hessian is $\\nabla^2 f = H$.' },
  { topic: 'linalg', type: 'numeric', q: 'For $f(x) = \\frac{1}{2} x^\\top H x - b^\\top x$ with $H = \\begin{bmatrix} 2 & 0 \\\\ 0 & 4 \\end{bmatrix}$, $b = (2, 8)$, the minimizer solves $Hx = b$. What is $x_1$?', a: 1, tol: 0.01,
    expl: '$2 x_1 = 2$, so $x_1 = 1$. Likewise $x_2 = 2$.' },
  { topic: 'linalg', type: 'mc', q: 'A direction $v$ is a descent direction for $f$ at $x$ when:',
    options: ['$\\nabla f(x)^\\top v > 0$', '$\\nabla f(x)^\\top v < 0$', '$\\nabla f(x)^\\top v = 0$', '$\\lVert v \\rVert = 1$'], a: 1,
    expl: 'A negative inner product with the gradient means $f$ decreases along $v$ for small steps.' },
  { topic: 'linalg', type: 'numeric', q: 'The least-squares objective $\\lVert Ax - y \\rVert_2^2$ written as $x^\\top H x + \\dots$ has $H = \\gamma A^\\top A$. What is $\\gamma$?', a: 2, tol: 0.01,
    expl: 'Expanding $\\lVert Ax - y \\rVert_2^2 = x^\\top(2 A^\\top A)x - 2(A^\\top y)^\\top x + \\lVert y \\rVert_2^2$, so the factor on $A^\\top A$ is 2 (using the $\\frac12 x^\\top H x$ convention $H = 2A^\\top A$).' },

  // SVD
  { topic: 'svd', type: 'mc', q: 'A symmetric matrix $A$ is positive semidefinite if and only if:',
    options: ['it is invertible', 'all its eigenvalues are $\\geq 0$', 'its determinant is positive', 'it is diagonal'], a: 1,
    expl: 'PSD means $x^\\top A x \\geq 0$ for all $x$, equivalently every eigenvalue is nonnegative.' },
  { topic: 'svd', type: 'numeric', q: 'For $A = \\begin{bmatrix} 3 & 1 \\\\ 1 & 3 \\end{bmatrix}$, the eigenvalues solve $\\lambda^2 - 6\\lambda + 8 = 0$. What is the largest eigenvalue?', a: 4, tol: 0.01,
    expl: 'trace = 6, det = 8, so $\\lambda^2 - 6\\lambda + 8 = 0$ gives $\\lambda = 4$ and $\\lambda = 2$.' },
  { topic: 'svd', type: 'mc', q: 'For a symmetric positive semidefinite matrix, the SVD and the eigendecomposition:',
    options: ['are unrelated', 'coincide ($\\sigma_i = \\lambda_i$, $U = V$)', 'differ by a sign', 'only coincide if the matrix is diagonal'], a: 1,
    expl: 'For symmetric PSD matrices the singular values equal the eigenvalues and the left and right singular vectors are the same.' },
  { topic: 'svd', type: 'numeric', q: 'A matrix has singular values $5, 3, 0, 0$. What is its rank?', a: 2, tol: 0,
    expl: 'The rank is the number of nonzero singular values: here, 2.' },
  { topic: 'svd', type: 'mc', q: 'The Schur complement turns the condition $A - X B^{-1} X^\\top \\succeq 0$ (with $B \\succ 0$) into:',
    options: ['a linear equation', 'a single block matrix inequality $\\begin{bmatrix} A & X \\\\ X^\\top & B \\end{bmatrix} \\succeq 0$', 'an eigenvalue problem', 'a quadratic constraint'], a: 1,
    expl: 'The Schur complement is the equivalence between the nonlinear matrix inequality and the single block LMI.' },

  // LS
  { topic: 'ls', type: 'mc', q: 'The normal equations for $\\min \\lVert Ax - y \\rVert_2^2$ are:',
    options: ['$Ax = y$', '$A^\\top A x = A^\\top y$', '$A A^\\top x = y$', '$x = A^{-1} y$'], a: 1,
    expl: 'Setting the gradient to zero gives $A^\\top A x = A^\\top y$, which always has at least one solution.' },
  { topic: 'ls', type: 'mc', q: 'When $A$ has full column rank, the least-squares solution is:',
    options: ['not unique', 'unique, $x^\\star = (A^\\top A)^{-1} A^\\top y$', 'zero', 'undefined'], a: 1,
    expl: 'Full column rank makes $A^\\top A$ invertible, giving the unique solution $A^\\dagger y$.' },
  { topic: 'ls', type: 'mc', q: 'Geometrically, $A x^\\star$ in least squares is:',
    options: ['the largest point in $R(A)$', 'the orthogonal projection of $y$ onto $R(A)$', 'the centroid of the data', 'always equal to $y$'], a: 1,
    expl: 'The residual $y - Ax^\\star$ is orthogonal to $R(A)$, so $Ax^\\star$ is the projection of $y$ onto the range of $A$.' },
  { topic: 'ls', type: 'numeric', q: 'KKT for $\\min \\frac{1}{2}\\lVert x \\rVert_2^2$ s.t. $Ax = b$ gives $x^\\star = A^\\top(AA^\\top)^{-1}b$. If $A = (1, 1)$ and $b = 4$, what is $x_1^\\star$?', a: 2, tol: 0.01,
    expl: '$AA^\\top = 2$, so $x^\\star = A^\\top \\cdot \\frac{1}{2} \\cdot 4 = (2, 2)$. The minimum-norm solution.' },

  // CONVEXITY
  { topic: 'convexity', type: 'mc', q: 'Which set is convex? $\\{x \\in \\mathbb{R}^2 : x_1^2 + x_2^2 \\leq 1\\}$, $\\{x : x_1^2 + x_2^2 \\geq 1\\}$, $\\{x : x_1^2 + x_2^2 = 1\\}$.',
    options: ['All three', 'Only the first (the disk)', 'Only the second', 'The first and third'], a: 1,
    expl: 'The disk is convex. The complement of a disk is not, and a circle is not (the chord exits the set).' },
  { topic: 'convexity', type: 'mc', q: 'A function $f$ is convex if and only if:',
    options: ['its domain is bounded', 'its epigraph is a convex set', 'it is differentiable', 'its sublevel sets are convex'], a: 1,
    expl: 'Convexity of $f$ is equivalent to convexity of its epigraph. Convex sublevel sets is weaker (quasiconvexity).' },
  { topic: 'convexity', type: 'mc', q: 'If all sublevel sets of $f$ are convex, then $f$ is:',
    options: ['convex', 'strictly convex', 'quasiconvex (not necessarily convex)', 'concave'], a: 2,
    expl: 'Convex sublevel sets define quasiconvexity. $\\log x$ has convex sublevel sets but is concave, not convex.' },
  { topic: 'convexity', type: 'mc', q: 'Which operation does NOT preserve convexity?',
    options: ['Pointwise maximum of convex functions', 'Nonnegative combination of convex functions', 'Pointwise minimum of convex functions', 'Affine substitution $f(Ax+b)$'], a: 2,
    expl: 'Pointwise maximum preserves convexity; pointwise minimum does not.' },
  { topic: 'convexity', type: 'mc', q: 'For a twice-differentiable $f$, "$\\nabla^2 f(x^\\star) \\succ 0$" is:',
    options: ['necessary for a local min', 'sufficient for a strict local min', 'both necessary and sufficient', 'neither'], a: 1,
    expl: 'Necessary for a local min is $\\nabla^2 f \\succeq 0$; sufficient for a strict local min is $\\nabla^2 f \\succ 0$. Do not swap them.' },

  // CVXPROB
  { topic: 'cvxprob', type: 'mc', q: 'In the convex standard form, the equality-constraint functions $h_i$ must be:',
    options: ['convex', 'concave', 'affine', 'quadratic'], a: 2,
    expl: 'Equality constraints must be affine; only then is the set $\\{h_i(x) = 0\\}$ convex.' },
  { topic: 'cvxprob', type: 'mc', q: 'For a convex problem, a locally optimal point is:',
    options: ['rarely globally optimal', 'always globally optimal', 'globally optimal only if unique', 'never globally optimal'], a: 1,
    expl: 'Convexity of the objective and feasible set guarantees every local optimum is global.' },
  { topic: 'cvxprob', type: 'mc', q: 'The optimality condition for an unconstrained convex problem is:',
    options: ['$\\nabla f_0(x) = 0$', '$\\nabla^2 f_0(x) = 0$', '$f_0(x) = 0$', '$x = 0$'], a: 0,
    expl: 'For unconstrained convex problems, $\\nabla f_0(x) = 0$ is necessary and sufficient.' },
  { topic: 'cvxprob', type: 'mc', q: 'The epigraph reformulation rewrites any convex problem with:',
    options: ['no constraints', 'a linear objective', 'a quadratic objective', 'fewer variables'], a: 1,
    expl: 'Introducing $t$ with $f_0(x) \\leq t$ and minimizing $t$ gives an equivalent problem with a linear objective.' },

  // LP
  { topic: 'lp', type: 'mc', q: 'A linear program is the special case of a QP with:',
    options: ['$c = 0$', '$H = 0$', '$A = 0$', '$b = 0$'], a: 1,
    expl: 'An LP is a QP whose quadratic term vanishes ($H = 0$), leaving only the linear objective.' },
  { topic: 'lp', type: 'mc', q: 'The intersection of finitely many half-spaces is called a:',
    options: ['cone', 'polyhedron', 'simplex', 'subspace'], a: 1,
    expl: 'A polyhedron is exactly an intersection of half-spaces; a bounded one is a polytope.' },
  { topic: 'lp', type: 'mc', q: 'In the Chebyshev approximation $\\min \\lVert Ax - b \\rVert_\\infty$ as an LP, the slack variable is:',
    options: ['a vector with $m$ components', 'a single scalar $t$', 'a matrix', 'not needed'], a: 1,
    expl: 'Chebyshev uses one scalar $t$ with $-t\\mathbf{1} \\leq Ax - b \\leq t\\mathbf{1}$. The $\\ell_1$ version uses a vector $t$.' },
  { topic: 'lp', type: 'mc', q: 'The classical method that walks the vertices of the feasible polyhedron is:',
    options: ['Newton’s method', 'the simplex algorithm', 'gradient descent', 'the barrier method'], a: 1,
    expl: 'The simplex algorithm explores vertices. It is fast in practice but has exponential worst-case complexity.' },
  { topic: 'lp', type: 'numeric', q: 'Toy LP: $\\min 3x_1 + 1.5x_2$ s.t. $-1 \\leq x_1 \\leq 2$, $0 \\leq x_2 \\leq 3$. What is the optimal value $p^\\star$?', a: -3, tol: 0.01,
    expl: 'Both coefficients are positive, so push $x_1$ to $-1$ and $x_2$ to $0$: $p^\\star = 3(-1) + 1.5(0) = -3$.' },

  // QP
  { topic: 'qp', type: 'mc', q: 'A QP $\\min \\frac{1}{2}x^\\top H x + c^\\top x$ s.t. $Ax \\leq b$ is convex (and tractable) when:',
    options: ['$H \\prec 0$', '$H \\succeq 0$', '$H$ is indefinite', '$c = 0$'], a: 1,
    expl: 'A QP is convex exactly when $H \\succeq 0$. If $H$ is indefinite the problem is generally intractable.' },
  { topic: 'qp', type: 'mc', q: 'The quadratic $\\frac{1}{2}x^\\top H x + c^\\top x$ with $H$ indefinite has the shape of:',
    options: ['an elliptic paraboloid', 'a hyperbolic paraboloid (saddle)', 'a flat plane', 'a sphere'], a: 1,
    expl: 'Mixed-sign eigenvalues give a saddle: a hyperbolic paraboloid, neither convex nor concave.' },
  { topic: 'qp', type: 'numeric', q: 'For $\\min \\frac{1}{2}x^\\top H x + c^\\top x$ with $H = \\begin{bmatrix} 2 & 0 \\\\ 0 & 2 \\end{bmatrix} \\succ 0$ and $c = (-4, -6)$, the minimizer is $x^\\star = -H^{-1}c$. What is $x_1^\\star$?', a: 2, tol: 0.01,
    expl: '$x^\\star = -H^{-1}c = -\\frac{1}{2}(-4, -6) = (2, 3)$.' },
  { topic: 'qp', type: 'mc', q: 'In the Markowitz model the objective $x^\\top \\Sigma x - \\gamma \\hat{r}^\\top x$ is a convex QP because:',
    options: ['$\\hat{r} > 0$', '$\\Sigma \\succeq 0$ (a covariance matrix)', '$\\gamma \\geq 0$', 'the constraints are linear'], a: 1,
    expl: 'The covariance matrix $\\Sigma$ is positive semidefinite, so the quadratic term is convex.' },

  // SOCP
  { topic: 'socp', type: 'mc', q: 'The giveaway form of a second-order cone constraint is:',
    options: ['$\\lVert Ax + b \\rVert_2 \\leq c^\\top x + d$', '$x^\\top Q x \\leq 0$', '$Ax = b$', '$F(x) \\succeq 0$'], a: 0,
    expl: 'A norm bounded by an affine function is the SOC constraint. A matrix inequality (LMI) signals an SDP.' },
  { topic: 'socp', type: 'mc', q: 'The containment of standard forms, smallest to largest, is:',
    options: ['SDP $\\subset$ SOCP $\\subset$ QP $\\subset$ LP', 'LP $\\subset$ QP $\\subset$ SOCP $\\subset$ SDP', 'QP $\\subset$ LP $\\subset$ SOCP $\\subset$ SDP', 'they are all disjoint'], a: 1,
    expl: 'LP $\\subset$ QP $\\subset$ SOCP $\\subset$ SDP. Anything that is an LP is also a QP, an SOCP, and an SDP.' },
  { topic: 'socp', type: 'mc', q: 'Classify: $\\min x_1 + x_2$ s.t. $\\lVert (x_1, x_2) \\rVert_2 \\leq x_3$, $x_3 \\leq 5$.',
    options: ['LP', 'QP', 'SOCP', 'non-convex'], a: 2,
    expl: 'The constraint is exactly norm leq affine, a second-order cone constraint. Not an LP (norm is nonlinear).' },
  { topic: 'socp', type: 'mc', q: 'A chance-constrained LP with Gaussian data and reliability $p_i > 0.5$ becomes:',
    options: ['another LP', 'an SOCP', 'a non-convex problem', 'a QP'], a: 1,
    expl: 'The probabilistic constraint $\\mathrm{Prob}\\{a_i^\\top x \\leq b_i\\} \\geq p_i$ converts to an SOC constraint involving $\\Phi^{-1}(p_i)$.' },

  // GP
  { topic: 'gp', type: 'mc', q: 'Which of these is NOT a posynomial (for $x, y > 0$)?',
    options: ['$2x + 3y$', '$x^{-1} + y$', '$-x + y$', '$x^{0.5} y^2$'], a: 2,
    expl: 'A posynomial needs positive coefficients. The minus sign on $x$ breaks it. Negative and fractional exponents are fine.' },
  { topic: 'gp', type: 'mc', q: 'A GP is made convex by:',
    options: ['squaring the objective', 'the substitution $y_i = \\ln x_i$ plus a log transform', 'dropping the constraints', 'adding slack variables'], a: 1,
    expl: 'The log change of variables turns monomials into exponentials and posynomials into log-sum-exp, which is convex.' },
  { topic: 'gp', type: 'mc', q: 'In GP standard form, the inequality constraints are written as:',
    options: ['$f_i(x) \\leq 0$', '$f_i(x) \\leq 1$', '$f_i(x) = 0$', '$f_i(x) \\geq 1$'], a: 1,
    expl: 'GP constraints are "posynomial $\\leq 1$" and "monomial $= 1$", not the usual "$\\leq 0$".' },
  { topic: 'gp', type: 'mc', q: 'A posynomial is best described as:',
    options: ['a sum of monomials with positive coefficients', 'any polynomial', 'a product of linear terms', 'a convex quadratic'], a: 0,
    expl: 'A posynomial is a nonnegative (positive-coefficient) sum of positive monomials over positive variables.' },

  // DUALITY
  { topic: 'duality', type: 'mc', q: 'The Lagrange dual function $g(\\lambda, \\nu)$ is:',
    options: ['always convex', 'always concave', 'convex only if the primal is convex', 'neither in general'], a: 1,
    expl: 'The dual function is a pointwise infimum of affine functions, hence concave, regardless of primal convexity.' },
  { topic: 'duality', type: 'mc', q: 'Weak duality states that:',
    options: ['$d^\\star = p^\\star$ always', '$d^\\star \\leq p^\\star$ always', '$d^\\star \\geq p^\\star$ always', '$d^\\star = 0$'], a: 1,
    expl: 'Weak duality: the dual optimum lower-bounds the primal optimum, $d^\\star \\leq p^\\star$, always.' },
  { topic: 'duality', type: 'mc', q: 'Strong duality for a convex problem is guaranteed by:',
    options: ['the objective being linear', 'Slater’s condition (a strictly feasible point exists)', 'the problem being unbounded', 'having no equality constraints'], a: 1,
    expl: 'Slater’s condition is the standard constraint qualification giving $d^\\star = p^\\star$ for convex problems.' },
  { topic: 'duality', type: 'mc', q: 'Which is NOT one of the four KKT conditions?',
    options: ['Stationarity $\\nabla_x L = 0$', 'Complementary slackness $\\lambda_i f_i(x) = 0$', 'Strong convexity of $f_0$', 'Dual feasibility $\\lambda \\geq 0$'], a: 2,
    expl: 'KKT is stationarity, primal feasibility, dual feasibility, complementary slackness. Strong convexity is not a KKT condition.' },
  { topic: 'duality', type: 'mc', q: 'The optimal dual variable $\\lambda_i^\\star$ has the interpretation of:',
    options: ['the constraint value', 'the sensitivity of $p^\\star$ to relaxing constraint $i$', 'the objective gradient', 'a step size'], a: 1,
    expl: 'Under strong duality $\\lambda_i^\\star = -\\partial p^\\star / \\partial u_i$: the sensitivity of the optimal value to the constraint.' },

  // GRADIENT
  { topic: 'gradient', type: 'mc', q: 'The gradient descent update is:',
    options: ['$x_{k+1} = x_k + s_k \\nabla f(x_k)$', '$x_{k+1} = x_k - s_k \\nabla f(x_k)$', '$x_{k+1} = x_k - \\nabla^2 f(x_k)^{-1}\\nabla f(x_k)$', '$x_{k+1} = -s_k \\nabla f(x_k)$'], a: 1,
    expl: 'Gradient descent moves along the negative gradient: $x_{k+1} = x_k - s_k \\nabla f(x_k)$.' },
  { topic: 'gradient', type: 'mc', q: 'The Armijo condition is used to:',
    options: ['compute the Hessian', 'guarantee a sufficient decrease when choosing the step size', 'project onto the feasible set', 'check convexity'], a: 1,
    expl: 'Armijo enforces a sufficient fraction of the decrease predicted by the tangent line; backtracking finds such a step.' },
  { topic: 'gradient', type: 'mc', q: 'For a smooth convex function, gradient descent reaches $f(x_k) - f^\\star \\leq \\epsilon$ in:',
    options: ['$O(\\log(1/\\epsilon))$', '$O(1/\\epsilon)$', '$O(1/\\epsilon^2)$', 'a constant number of'], a: 1,
    expl: 'Smooth convex gives sublinear $O(1/\\epsilon)$. Strong convexity improves this to linear $O(\\log(1/\\epsilon))$.' },
  { topic: 'gradient', type: 'numeric', q: 'Gradient step with $x_k = 1$, $\\nabla f(x_k) = 0.5$, $s_k = 0.2$. What is $x_{k+1}$?', a: 0.9, tol: 0.001,
    expl: '$x_{k+1} = 1 - 0.2 \\cdot 0.5 = 0.9$.' },
  { topic: 'gradient', type: 'mc', q: 'On a non-convex smooth function, gradient descent is guaranteed to converge to:',
    options: ['the global minimum', 'a stationary point ($\\nabla f = 0$), not necessarily a minimum', 'a saddle point', 'nothing'], a: 1,
    expl: 'Without convexity you only get convergence to a stationary point, which need not be a local minimum.' },

  // NEWTON
  { topic: 'newton', type: 'mc', q: 'The pure Newton update is:',
    options: ['$x_{k+1} = x_k - s_k \\nabla f(x_k)$', '$x_{k+1} = x_k - \\nabla^2 f(x_k)^{-1} \\nabla f(x_k)$', '$x_{k+1} = x_k - \\nabla^2 f(x_k) \\nabla f(x_k)$', '$x_{k+1} = x_k + \\nabla f(x_k)$'], a: 1,
    expl: 'Newton minimizes the second-order model, giving $x_{k+1} = x_k - \\nabla^2 f(x_k)^{-1}\\nabla f(x_k)$.' },
  { topic: 'newton', type: 'mc', q: 'Newton’s method is affine invariant, which means:',
    options: ['it ignores the objective', 'progress does not depend on how the problem is scaled', 'it needs no Hessian', 'it only works for linear problems'], a: 1,
    expl: 'Under a change of variables $x = Ay$, the Newton iterates transform consistently. Gradient descent lacks this.' },
  { topic: 'newton', type: 'mc', q: 'Near the optimum, the damped Newton method converges:',
    options: ['linearly', 'quadratically', 'sublinearly', 'not at all'], a: 1,
    expl: 'In the pure phase the error roughly squares each step: quadratic convergence. Gradient descent only manages linear.' },
  { topic: 'newton', type: 'mc', q: 'The Newton decrement $\\lambda(x)$ is used as:',
    options: ['the step size', 'a stopping criterion ($\\frac{1}{2}\\lambda^2$ estimates the gap)', 'the search direction', 'the Lipschitz constant'], a: 1,
    expl: '$\\frac{1}{2}\\lambda(x)^2$ approximates $f(x) - f^\\star$, so it is the natural stopping test. It is also affine invariant.' },
  { topic: 'newton', type: 'mc', q: 'Compared to gradient descent, the main cost of a Newton iteration is:',
    options: ['storing the gradient', 'solving a linear system with the Hessian', 'evaluating the objective', 'projecting onto the feasible set'], a: 1,
    expl: 'Each Newton step solves $\\nabla^2 f \\cdot v = -\\nabla f$, which is expensive but buys quadratic convergence.' },

  // CONSTRAINED
  { topic: 'constrained', type: 'mc', q: 'The projected gradient update is:',
    options: ['$x_{k+1} = x_k - s_k \\nabla f(x_k)$', '$x_{k+1} = P_X(x_k - s_k \\nabla f(x_k))$', '$x_{k+1} = P_X(x_k)$', '$x_{k+1} = x_k - \\nabla^2 f^{-1} \\nabla f$'], a: 1,
    expl: 'Projected gradient takes a gradient step, then projects back onto the feasible set $X$.' },
  { topic: 'constrained', type: 'mc', q: 'The projection of $x$ onto the box $\\{x^{low} \\leq x \\leq x^{up}\\}$ is:',
    options: ['always zero', 'clamping each coordinate to its bounds', 'dividing by the norm', 'the average of the bounds'], a: 1,
    expl: 'For a box, each coordinate is independently clamped into its interval.' },
  { topic: 'constrained', type: 'mc', q: 'The logarithmic barrier $\\phi(x) = -\\sum \\log(-f_i(x))$ replaces:',
    options: ['the objective', 'the non-differentiable indicator of the inequality constraints', 'the equality constraints', 'the gradient'], a: 1,
    expl: 'The smooth log-barrier approximates the indicator function $I_-(u)$, which is non-differentiable.' },
  { topic: 'constrained', type: 'mc', q: 'The minimizer $x^\\star(t)$ of the barrier problem is:',
    options: ['exactly optimal', '$m/t$-suboptimal, and traces the central path', 'always infeasible', 'independent of $t$'], a: 1,
    expl: 'As $t \\to \\infty$, $x^\\star(t) \\to x^\\star$, with suboptimality bounded by $m/t$. The set of these points is the central path.' },
  { topic: 'constrained', type: 'mc', q: 'Phase 1 of the barrier method exists to:',
    options: ['speed up convergence', 'find a strictly feasible starting point (or prove infeasibility)', 'compute the Hessian', 'choose the step size'], a: 1,
    expl: 'The barrier method needs a strictly feasible start; Phase 1 solves $\\min s$ s.t. $f_i(x) \\leq s$ to find one.' },
];

// =================== FLASHCARD DATA ===================
const FLASHCARDS = [
  // LINALG
  { topic: 'linalg', front: 'Gradient and Hessian of $f(x) = \\frac{1}{2}x^\\top H x + c^\\top x + d$?', back: '$\\nabla f(x) = Hx + c$<br>$\\nabla^2 f(x) = H$<br>The Hessian is constant, so the curvature is the same everywhere.' },
  { topic: 'linalg', front: 'Where are the stationary points of a quadratic $\\frac{1}{2}x^\\top H x + c^\\top x$?', back: 'They solve the linear system $Hx = -c$. If $H \\succ 0$ there is a unique one: $x^\\star = -H^{-1}c$.' },
  { topic: 'linalg', front: 'What makes a direction $v$ a descent direction at $x$?', back: 'A negative inner product with the gradient: $\\nabla f(x)^\\top v < 0$. Then $f$ decreases along $v$ for small steps.' },
  { topic: 'linalg', front: 'Steepest descent direction in the Euclidean norm?', back: 'The negative gradient, $v = -\\nabla f(x)$. This follows from Cauchy-Schwarz.' },
  { topic: 'linalg', front: 'The least-squares objective $\\lVert Ax - y \\rVert_2^2$ as a quadratic: what are $H$, $c$, $d$?', back: '$H = 2A^\\top A$, $c = -2A^\\top y$, $d = \\lVert y \\rVert_2^2$. Since $A^\\top A \\succeq 0$, the objective is convex.' },
  { topic: 'linalg', front: 'Orthogonal projection of $y$ onto $R(A)$ (with $A$ full column rank)?', back: '$P_{R(A)} y = A(A^\\top A)^{-1} A^\\top y$. This is also the least-squares prediction $A\\hat{x}$.' },
  { topic: 'linalg', front: 'When is $\\frac{1}{2}x^\\top H x + c^\\top x$ convex? Strongly convex?', back: 'Convex iff $H \\succeq 0$ (all eigenvalues $\\geq 0$). Strongly convex iff $H \\succ 0$ (all eigenvalues $> 0$).' },

  // SVD
  { topic: 'svd', front: 'State the spectral theorem for symmetric matrices.', back: 'Any symmetric $A$ factors as $A = U \\Lambda U^\\top$ with $U$ orthogonal and real eigenvalues on $\\Lambda$. Symmetric matrices always have an orthonormal eigenvector basis.' },
  { topic: 'svd', front: 'When is a symmetric matrix PSD? PD?', back: 'PSD ($A \\succeq 0$): $x^\\top A x \\geq 0$ for all $x$, i.e. all eigenvalues $\\geq 0$.<br>PD ($A \\succ 0$): all eigenvalues $> 0$.' },
  { topic: 'svd', front: 'What is the Rayleigh quotient and what are its extremes?', back: 'The ratio $\\frac{x^\\top A x}{x^\\top x}$ for symmetric $A$. Its max over $x \\neq 0$ is $\\lambda_{\\max}$, its min is $\\lambda_{\\min}$, each attained along the corresponding eigenvector.' },
  { topic: 'svd', front: 'State the SVD of a matrix $A$.', back: '$A = U \\Sigma V^\\top$ with $U, V$ orthonormal and $\\Sigma = \\mathrm{diag}(\\sigma_1, \\dots, \\sigma_r)$, $\\sigma_i > 0$. Works for any matrix, square or rectangular.' },
  { topic: 'svd', front: 'How do the singular values and vectors relate to $A^\\top A$ and $AA^\\top$?', back: 'The $v_i$ are eigenvectors of $A^\\top A$, the $u_i$ are eigenvectors of $AA^\\top$, and $\\sigma_i^2$ are the corresponding eigenvalues.' },
  { topic: 'svd', front: 'DISAMBIGUATION: eigendecomposition vs SVD.', back: 'Eigendecomposition: symmetric matrices only.<br>SVD: any matrix.<br>For a symmetric PSD matrix they coincide: $\\sigma_i = \\lambda_i$, $U = V$.' },
  { topic: 'svd', front: 'What does the rank of $A$ equal in terms of singular values?', back: 'The number of nonzero singular values. Also: $\\lVert A \\rVert_2 = \\sigma_{\\max}$ and $\\lVert A \\rVert_F^2 = \\sum_i \\sigma_i^2$.' },
  { topic: 'svd', front: 'What does the Schur complement do?', back: 'It converts a nonlinear matrix inequality $A - XB^{-1}X^\\top \\succeq 0$ (with $B \\succ 0$) into a single block LMI $\\begin{bmatrix} A & X \\\\ X^\\top & B \\end{bmatrix} \\succeq 0$.' },

  // LS
  { topic: 'ls', front: 'What are the normal equations?', back: '$A^\\top A x = A^\\top y$. They come from setting $\\nabla \\lVert Ax - y \\rVert_2^2 = 0$ and always have at least one solution.' },
  { topic: 'ls', front: 'When is the least-squares solution unique, and what is it?', back: 'When $A$ has full column rank. Then $A^\\top A$ is invertible and $x^\\star = (A^\\top A)^{-1}A^\\top y = A^\\dagger y$.' },
  { topic: 'ls', front: 'Geometric meaning of $Ax^\\star$ in least squares?', back: 'It is the orthogonal projection of $y$ onto $R(A)$. The residual $y - Ax^\\star$ is orthogonal to $R(A)$ -- that is what $A^\\top(y - Ax^\\star) = 0$ says.' },
  { topic: 'ls', front: 'KKT solution of $\\min \\frac{1}{2}\\lVert x \\rVert_2^2$ s.t. $Ax = b$?', back: 'Lagrangian $L = \\frac{1}{2}\\lVert x \\rVert_2^2 + \\nu^\\top(Ax - b)$. Stationarity gives $x = -A^\\top \\nu$; feasibility gives $x^\\star = A^\\top(AA^\\top)^{-1}b$, the minimum-norm solution.' },
  { topic: 'ls', front: 'Ridge regression vs LASSO -- what changes?', back: 'Ridge: $+\\lambda \\lVert x \\rVert_2^2$, stays a convex quadratic, solved by $(A^\\top A + \\lambda I)x = A^\\top y$.<br>LASSO: $+\\lambda \\lVert x \\rVert_1$, casts as a QP, gives sparse solutions.' },
  { topic: 'ls', front: 'Why is least squares an easy convex problem?', back: 'It is an unconstrained convex quadratic ($A^\\top A \\succeq 0$), so $\\nabla f = 0$ is necessary and sufficient -- the normal equations are the whole story.' },

  // CONVEXITY
  { topic: 'convexity', front: 'Definition of a convex SET.', back: 'A set $C$ is convex if for all $x_1, x_2 \\in C$ and $\\lambda \\in [0,1]$, the point $\\lambda x_1 + (1-\\lambda)x_2 \\in C$. It contains the chord between any two of its points.' },
  { topic: 'convexity', front: 'Definition of a convex FUNCTION.', back: '$f(\\lambda x + (1-\\lambda)y) \\leq \\lambda f(x) + (1-\\lambda)f(y)$ for all $x, y$ and $\\lambda \\in [0,1]$. The function lies below its chords.' },
  { topic: 'convexity', front: 'DISAMBIGUATION: convex set vs convex function -- the link.', back: '$f$ is convex iff its epigraph $\\{(x,t): f(x) \\leq t\\}$ is a convex SET. So a convex function is defined through a convex set.' },
  { topic: 'convexity', front: 'THE TRAP: does "all sublevel sets of $f$ are convex" imply $f$ is convex?', back: 'No. That is quasiconvexity, which is weaker. $\\log x$ is concave but has convex (interval) sublevel sets. Convex $f$ implies convex sublevel sets, not the converse.' },
  { topic: 'convexity', front: 'Strict vs strong convexity.', back: 'Strict: the convexity inequality is strict for $x \\neq y$.<br>Strong (parameter $m$): $f - \\frac{m}{2}\\lVert x \\rVert_2^2$ is still convex. Strong implies strict implies convex.' },
  { topic: 'convexity', front: 'Which operations preserve convexity of functions?', back: 'Nonnegative combinations, affine substitution $f(Ax+b)$, pointwise MAXIMUM, and composition under monotonicity rules. Pointwise minimum does NOT.' },
  { topic: 'convexity', front: 'First-order condition for convexity (differentiable $f$).', back: '$f(y) \\geq f(x) + \\nabla f(x)^\\top(y - x)$ for all $x, y$. The graph lies above every tangent hyperplane.' },
  { topic: 'convexity', front: 'Second-order condition for convexity.', back: '$f$ is convex iff $\\nabla^2 f(x) \\succeq 0$ everywhere. $\\nabla^2 f \\succ 0$ everywhere implies strict convexity (not conversely -- see $x^4$).' },
  { topic: 'convexity', front: 'DISAMBIGUATION: necessary vs sufficient second-order conditions for a local min.', back: 'Necessary: $\\nabla^2 f(x^\\star) \\succeq 0$.<br>Sufficient: $\\nabla^2 f(x^\\star) \\succ 0$.<br>Do not swap them. $\\succ 0$ is NOT necessary.' },

  // CVXPROB
  { topic: 'cvxprob', front: 'What makes an optimization problem a CONVEX problem?', back: 'Convex objective $f_0$, convex inequality functions $f_i$, and AFFINE equality functions $h_i$. The feasible set is then convex.' },
  { topic: 'cvxprob', front: 'The single most important consequence of convexity.', back: 'Any locally optimal point is globally optimal, and the optimal set is convex. A solver that finds a local min has found the answer.' },
  { topic: 'cvxprob', front: 'Active vs inactive (slack) constraint at $x^\\star$.', back: 'Active: $f_i(x^\\star) = 0$ (the constraint is binding).<br>Inactive / slack: $f_i(x^\\star) < 0$ (the constraint is not tight).' },
  { topic: 'cvxprob', front: 'What is the epigraph reformulation?', back: 'Any convex problem rewrites with a LINEAR objective: $\\min t$ s.t. $f_0(x) \\leq t$ plus the original constraints.' },
  { topic: 'cvxprob', front: 'Optimality condition: unconstrained convex problem.', back: '$\\nabla f_0(x) = 0$ -- necessary and sufficient.' },
  { topic: 'cvxprob', front: 'Optimality condition: equality-constrained convex problem $\\min f_0$ s.t. $Ax = b$.', back: '$Ax = b$ and there exists $\\nu$ with $\\nabla f_0(x) + A^\\top \\nu = 0$. The gradient lies in the row space of $A$.' },
  { topic: 'cvxprob', front: 'General first-order optimality over a convex set $X$.', back: '$x$ is optimal iff $\\nabla f_0(x)^\\top(y - x) \\geq 0$ for all $y \\in X$: there is no feasible descent direction.' },

  // LP
  { topic: 'lp', front: 'LP standard form vs inequality form.', back: 'Inequality form: $\\min c^\\top x$ s.t. $Ax \\leq b$.<br>Standard form: $\\min \\tilde{c}^\\top \\tilde{x}$ s.t. $\\tilde{A}\\tilde{x} = \\tilde{b}$, $\\tilde{x} \\geq 0$. Convert by splitting $x = x^+ - x^-$ and adding slacks.' },
  { topic: 'lp', front: 'One-line tell for an LP.', back: 'Only linear stuff, anywhere -- linear objective, linear equalities and inequalities. It is the QP with $H = 0$.' },
  { topic: 'lp', front: 'What is a polyhedron? A polytope?', back: 'Polyhedron: intersection of finitely many half-spaces.<br>Polytope: a bounded polyhedron.' },
  { topic: 'lp', front: 'THE MOST-CONFUSED PAIR: Chebyshev approximation as an LP.', back: '$\\min \\lVert Ax - b \\rVert_\\infty$ becomes $\\min t$ s.t. $-t\\mathbf{1} \\leq Ax - b \\leq t\\mathbf{1}$. ONE scalar $t$.' },
  { topic: 'lp', front: 'THE MOST-CONFUSED PAIR: $\\ell_1$ minimization as an LP.', back: '$\\min \\lVert Ax - b \\rVert_1$ becomes $\\min \\mathbf{1}^\\top t$ s.t. $-t \\leq Ax - b \\leq t$. A VECTOR $t$ with $m$ components.<br>The dimension of the slack tells you which is which.' },
  { topic: 'lp', front: 'Simplex vs interior-point for LP.', back: 'Simplex: walks the vertices of the polyhedron; great in practice, exponential worst case.<br>Interior-point (Karmarkar 1984): polynomial worst-case complexity.' },
  { topic: 'lp', front: 'Name three LPs from the course.', back: 'The diet problem (min cost, nutritional lower bounds), max-flow on a network (flow conservation + capacities), and thruster force allocation (min fuel, desired net force/torque).' },

  // QP
  { topic: 'qp', front: 'One-line tell for a QP.', back: 'Quadratic objective $\\frac{1}{2}x^\\top H x + c^\\top x$, LINEAR constraints, and $H \\succeq 0$. If the constraints are also quadratic, it is a QCQP, not a QP.' },
  { topic: 'qp', front: 'How does the sign of $H$ control the shape of a quadratic?', back: '$H \\succ 0$: strongly convex (elliptic paraboloid). $H \\succeq 0$: convex. $H \\preceq 0$: concave. $H$ indefinite: a saddle (hyperbolic paraboloid), neither convex nor concave.' },
  { topic: 'qp', front: 'When is a QP tractable?', back: 'When $H \\succeq 0$ -- then it is convex and efficiently solvable. If $H \\not\\succeq 0$ the QP is generally intractable.' },
  { topic: 'qp', front: 'Unconstrained quadratic $\\frac{1}{2}x^\\top H x + c^\\top x$: when does a minimizer exist?', back: 'If $H$ has a negative eigenvalue: unbounded below. If $H \\succeq 0$ and $c \\in R(H)$: minimum exists. If $H \\succ 0$: unique minimizer $x^\\star = -H^{-1}c$.' },
  { topic: 'qp', front: 'Why is the Markowitz portfolio problem a convex QP?', back: 'The objective $x^\\top \\Sigma x - \\gamma \\hat{r}^\\top x$ has $\\Sigma \\succeq 0$ (a covariance matrix), and the constraints $x \\geq 0$, $\\mathbf{1}^\\top x = 1$ are linear.' },
  { topic: 'qp', front: 'How does the LASSO become a QP?', back: 'Introduce $u$ with $-u \\leq x \\leq u$, then minimize $\\lVert Ax - y \\rVert_2^2 + \\lambda \\mathbf{1}^\\top u$ -- a quadratic objective with linear constraints.' },

  // SOCP
  { topic: 'socp', front: 'What is the second-order (ice-cream) cone?', back: '$K_n = \\{(z, u) : \\lVert z \\rVert_2 \\leq u\\}$. A convex cone; intersections of convex cones are convex cones.' },
  { topic: 'socp', front: 'One-line tell for an SOCP constraint.', back: 'A norm bounded by an affine function: $\\lVert Ax + b \\rVert_2 \\leq c^\\top x + d$. That is the giveaway.' },
  { topic: 'socp', front: 'Why keep the SOC constraint in norm form rather than squaring it?', back: 'Squaring gives $\\lVert Ax+b \\rVert_2^2 \\leq (c^\\top x + d)^2$, whose Hessian $A^\\top A - cc^\\top$ may be indefinite -- not convex. The norm form is always convex.' },
  { topic: 'socp', front: 'Containment of the standard forms, smallest to largest.', back: '$\\text{LP} \\subset \\text{QP} \\subset \\text{SOCP} \\subset \\text{SDP}$. Anything that is an LP is also a QP, an SOCP, and an SDP.' },
  { topic: 'socp', front: 'How does an LP constraint sit inside SOCP?', back: '$a_i^\\top x \\leq b_i$ is the SOC constraint $\\lVert 0 \\rVert_2 \\leq b_i - a_i^\\top x$ (zero left side).' },
  { topic: 'socp', front: 'What kind of problem do chance-constrained LPs become?', back: 'An SOCP. For Gaussian data with reliability $p_i > 0.5$, $\\mathrm{Prob}\\{a_i^\\top x \\leq b_i\\} \\geq p_i$ becomes $\\bar{a}_i^\\top x \\leq b_i - \\Phi^{-1}(p_i)\\lVert \\Sigma_i^{1/2} x \\rVert_2$.' },

  // GP
  { topic: 'gp', front: 'What is a monomial in GP? A posynomial?', back: 'Monomial: $c\\, x_1^{a_1} \\cdots x_n^{a_n}$ with $c > 0$, $x > 0$, any real exponents.<br>Posynomial: a sum of positive monomials.' },
  { topic: 'gp', front: 'THE RECOGNITION TEST for a posynomial.', back: 'Positive coefficients, positive variables, ANY real exponents (negative and fractional allowed). A single minus sign on a coefficient breaks it.' },
  { topic: 'gp', front: 'Is $-x + y$ a posynomial (for $x, y > 0$)? Is $x^{-1} + y$?', back: '$-x + y$: NO -- negative coefficient. $x^{-1} + y$: YES -- negative exponents are fine, only negative coefficients are not.' },
  { topic: 'gp', front: 'GP standard form -- what is unusual about the constraints?', back: 'They are "$f_i(x) \\leq 1$" and "$h_i(x) = 1$" (posynomials and monomials), not the usual "$\\leq 0$".' },
  { topic: 'gp', front: 'How is a GP made convex?', back: 'Substitute $y_i = \\ln x_i$. Monomials become $e^{a^\\top y + b}$ (convex), posynomials become sums of exponentials, and taking logs gives the log-sum-exp function -- convex.' },
  { topic: 'gp', front: 'How are fractional powers and maxima handled in GP?', back: 'With slack variables. $f_1^{2.2} + f_2^{3.1} \\leq 1$ becomes $t_1^{2.2} + t_2^{3.1} \\leq 1$ with $f_1 \\leq t_1$, $f_2 \\leq t_2$. Similarly $\\max(f_1, f_2) + f_3 \\leq 1$ becomes $t + f_3 \\leq 1$, $f_1 \\leq t$, $f_2 \\leq t$.' },

  // DUALITY
  { topic: 'duality', front: 'Write the Lagrangian.', back: '$L(x, \\lambda, \\nu) = f_0(x) + \\sum_i \\lambda_i f_i(x) + \\sum_i \\nu_i h_i(x)$, with $\\lambda \\geq 0$. It is just a function -- no convexity assumed.' },
  { topic: 'duality', front: 'DISAMBIGUATION: Lagrangian vs KKT.', back: 'The Lagrangian is a single FUNCTION $L(x, \\lambda, \\nu)$. KKT is a four-part SYSTEM of optimality conditions. One is notation, the other is a test.' },
  { topic: 'duality', front: 'What are the four KKT conditions?', back: '1. Stationarity: $\\nabla_x L = 0$.<br>2. Primal feasibility: $f_i \\leq 0$, $h_i = 0$.<br>3. Dual feasibility: $\\lambda \\geq 0$.<br>4. Complementary slackness: $\\lambda_i f_i(x) = 0$.' },
  { topic: 'duality', front: 'Is the dual function $g(\\lambda, \\nu)$ always convex or concave?', back: 'Always CONCAVE -- it is a pointwise infimum of affine functions of $(\\lambda, \\nu)$. This holds even when the primal is not convex.' },
  { topic: 'duality', front: 'Weak duality vs strong duality.', back: 'Weak: $d^\\star \\leq p^\\star$, always.<br>Strong: $d^\\star = p^\\star$, holds for convex problems under a constraint qualification (Slater).' },
  { topic: 'duality', front: 'What is Slater’s condition?', back: 'There exists a strictly feasible point ($f_i(x) < 0$ for the non-affine inequalities, $h_i(x) = 0$). It guarantees strong duality for a convex problem.' },
  { topic: 'duality', front: 'When is KKT necessary AND sufficient for optimality?', back: 'For a convex problem with Slater’s condition satisfied. Without convexity, KKT is only necessary (given a constraint qualification).' },
  { topic: 'duality', front: 'Interpretation of the optimal dual variable $\\lambda_i^\\star$.', back: 'The sensitivity of the optimal value to relaxing constraint $i$: $\\lambda_i^\\star = -\\partial p^\\star / \\partial u_i$. A large multiplier means a tight, expensive constraint.' },
  { topic: 'duality', front: 'Dual of the LP $\\min c^\\top x$ s.t. $Ax \\leq b$.', back: '$\\max -b^\\top \\lambda$ s.t. $A^\\top \\lambda + c = 0$, $\\lambda \\geq 0$. The dual of an LP is an LP. (Sign conventions vary -- be able to derive it.)' },

  // GRADIENT
  { topic: 'gradient', front: 'Gradient descent update rule.', back: '$x_{k+1} = x_k - s_k \\nabla f_0(x_k)$. The negative gradient is the steepest descent direction in the Euclidean norm.' },
  { topic: 'gradient', front: 'What is the Armijo (sufficient decrease) condition?', back: '$f_0(x_k + s v_k) \\leq f_0(x_k) + s\\,\\alpha\\,\\nabla f_0(x_k)^\\top v_k$ with $\\alpha \\in (0,1)$. It asks for a sufficient fraction of the tangent-line decrease.' },
  { topic: 'gradient', front: 'How does backtracking line search work?', back: 'Start at $s = s_{init}$ (usually 1). While Armijo fails, shrink $s \\leftarrow \\beta s$ with $\\beta \\in (0,1)$. It avoids needing the Lipschitz constant.' },
  { topic: 'gradient', front: 'What is the descent lemma?', back: 'If $\\nabla f_0$ is Lipschitz with constant $L$, then $f_0(x) \\leq f_0(y) + \\nabla f_0(y)^\\top(x-y) + \\frac{L}{2}\\lVert x-y \\rVert_2^2$. One gradient step minimizes this quadratic upper model.' },
  { topic: 'gradient', front: 'Convergence rate of gradient descent: convex vs strongly convex.', back: 'Smooth convex: $O(1/\\epsilon)$ iterations (sublinear).<br>Smooth strongly convex: $O(\\log(1/\\epsilon))$ (linear).' },
  { topic: 'gradient', front: 'What does gradient descent converge to on a non-convex function?', back: 'A stationary point ($\\nabla f_0 = 0$), which is not necessarily a local minimum. For convex $f_0$, a stationary point IS a global minimum.' },
  { topic: 'gradient', front: 'Trade-offs of gradient descent.', back: 'For: cheap iterations, no Hessian, scales well. Against: slow on ill-conditioned problems (zig-zagging), needs differentiability.' },

  // NEWTON
  { topic: 'newton', front: 'The pure Newton update.', back: '$x_{k+1} = x_k - \\nabla^2 f_0(x_k)^{-1} \\nabla f_0(x_k)$. It minimizes the local second-order (Hessian) model of $f_0$.' },
  { topic: 'newton', front: 'DISAMBIGUATION: gradient vs Newton.', back: 'Gradient: $x_{k+1} = x_k - s_k \\nabla f$, cheap, linear convergence at best.<br>Newton: $x_{k+1} = x_k - (\\nabla^2 f)^{-1}\\nabla f$, a linear solve per step, quadratic convergence near the optimum.' },
  { topic: 'newton', front: 'What does affine invariance mean for Newton’s method?', back: 'Under a change of variables $x = Ay$, the Newton iterates transform consistently -- progress does not depend on problem scaling. Gradient descent does NOT have this.' },
  { topic: 'newton', front: 'What is the Newton decrement and what is it used for?', back: '$\\lambda(x) = (\\nabla f^\\top (\\nabla^2 f)^{-1} \\nabla f)^{1/2}$. The quantity $\\frac{1}{2}\\lambda^2$ estimates the suboptimality gap, so it is the stopping criterion.' },
  { topic: 'newton', front: 'Pure vs damped Newton.', back: 'Pure: full step, can overshoot. Damped: $x_{k+1} = x_k + tv$ with $t$ from backtracking. The Newton direction is always a descent direction since $\\nabla f^\\top v = -\\lambda^2 < 0$.' },
  { topic: 'newton', front: 'The two phases of damped Newton convergence.', back: 'Damped phase: gradient large, $f_0$ drops by at least a constant $\\gamma$ per step.<br>Pure phase: gradient small, $t = 1$ accepted, QUADRATIC convergence.' },
  { topic: 'newton', front: 'Rule of thumb: when to use Newton vs gradient descent.', back: 'If the Hessian is cheap to form and solve, use Newton (quadratic convergence, affine invariant). If you can only afford gradients, use gradient descent.' },

  // CONSTRAINED
  { topic: 'constrained', front: 'Why is constrained optimization harder than unconstrained?', back: 'The optimum need not be a stationary point of $f_0$ -- it often sits on the constraint boundary where $\\nabla f_0 \\neq 0$. Just running a descent method does not work.' },
  { topic: 'constrained', front: 'The projected gradient update.', back: '$x_{k+1} = P_X(x_k - s_k \\nabla f_0(x_k))$: a gradient step, then project back onto the feasible set $X$.' },
  { topic: 'constrained', front: 'Which sets have a cheap projection?', back: 'A box (clamp each coordinate), the $\\ell_2$ ball ($x$ if inside, else $x/\\lVert x \\rVert_2$), and the probability simplex (fast $O(n)$ algorithm).' },
  { topic: 'constrained', front: 'What is the logarithmic barrier?', back: '$\\phi(x) = -\\sum_i \\log(-f_i(x))$. A smooth approximation of the non-differentiable indicator of the inequality constraints; it blows up at the boundary.' },
  { topic: 'constrained', front: 'What is the central path?', back: 'The set of minimizers $x^\\star(t)$ of $\\min t f_0(x) + \\phi(x)$ s.t. $Ax = b$, as $t$ varies. As $t \\to \\infty$, $x^\\star(t) \\to x^\\star$, and $x^\\star(t)$ is $m/t$-suboptimal.' },
  { topic: 'constrained', front: 'How does the barrier method actually run?', back: 'Start at small $t_0$, solve for $x^\\star(t_0)$ with Newton, then increase $t \\leftarrow \\mu t$ and re-solve warm-started. Each re-solve is a centering step; repeat until $m/t \\leq \\epsilon$.' },
  { topic: 'constrained', front: 'What is Phase 1 for?', back: 'Finding a strictly feasible starting point (or proving infeasibility). Solve $\\min s$ s.t. $f_i(x) \\leq s$, $Ax = b$: if $\\tilde{s} < 0$ the minimizer is strictly feasible; if $\\tilde{s} > 0$ the problem is infeasible.' },
];

// =================== STATE ===================
const state = {
  view: 'plan',
  currentTopic: TOPICS[0].id,
  completed: new Set(),
  quizFilter: 'all',
  quizIdx: 0,
  quizAnswered: new Map(),
  quizCorrect: 0,
  quizWrong: 0,
  flashFilter: 'all',
  flashIdx: 0,
  flashFlipped: false,
  flashAnswered: new Map(),
};

const PHASES = [
  { key: 'foundations', label: 'Foundations', grid: 'grid-foundations' },
  { key: 'theory', label: 'Convexity & standard forms', grid: 'grid-theory' },
  { key: 'algorithms', label: 'Algorithms', grid: 'grid-algorithms' },
];

// =================== RENDER PLAN ===================
function renderPlan() {
  const grids = { foundations: '', theory: '', algorithms: '' };
  TOPICS.forEach(t => {
    const checked = state.completed.has(t.id);
    const priClass = t.priority === 'new' ? 'priority-new' : (t.priority === 'core' ? 'priority-core' : 'priority-light');
    const priLabel = t.priority === 'new' ? 'NEW' : (t.priority === 'core' ? 'CORE' : 'REVIEW');
    grids[t.phase] += `
      <div class="topic-card" data-topic="${t.id}">
        <div class="topic-card-head">
          <span class="topic-priority ${priClass}">${priLabel}</span>
          <div class="topic-checkbox ${checked ? 'checked' : ''}" data-check="${t.id}"></div>
        </div>
        <h3>${t.title}</h3>
        <div class="topic-desc">${t.desc}</div>
        <div class="topic-actions">
          <a data-read="${t.id}">&#128214; Read</a>
          <a data-quiz="${t.id}">&#127919; Quiz</a>
        </div>
      </div>`;
  });
  PHASES.forEach(p => { document.getElementById(p.grid).innerHTML = grids[p.key]; });
  document.getElementById('progress-num').textContent = `${state.completed.size}/${TOPICS.length}`;

  document.querySelectorAll('[data-check]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      const id = el.dataset.check;
      if (state.completed.has(id)) state.completed.delete(id);
      else state.completed.add(id);
      renderPlan();
    });
  });
  document.querySelectorAll('[data-read]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      switchView('read');
      selectTopic(el.dataset.read);
    });
  });
  document.querySelectorAll('[data-quiz]').forEach(el => {
    el.addEventListener('click', e => {
      e.stopPropagation();
      switchView('quiz');
      document.getElementById('quiz-filter').value = el.dataset.quiz;
      state.quizFilter = el.dataset.quiz;
      resetQuizPosition();
      renderQuiz();
    });
  });
  document.querySelectorAll('.topic-card').forEach(el => {
    el.addEventListener('click', () => {
      switchView('read');
      selectTopic(el.dataset.topic);
    });
  });
}

// =================== RENDER READ ===================
function renderRead() {
  let sidebarHtml = PHASES.map(p => `
    <div class="sidebar-section">
      <div class="sidebar-label">${p.label}</div>
      ${TOPICS.filter(t => t.phase === p.key).map(t =>
        `<a class="sidebar-link ${state.currentTopic === t.id ? 'active' : ''}" data-link="${t.id}">${t.title}</a>`).join('')}
    </div>`).join('');
  document.getElementById('sidebar').innerHTML = sidebarHtml;
  document.querySelectorAll('[data-link]').forEach(el => {
    el.addEventListener('click', () => selectTopic(el.dataset.link));
  });

  const c = CONTENT[state.currentTopic];
  if (!c) {
    document.getElementById('read-content').innerHTML = '<p>Pick a topic from the sidebar.</p>';
    return;
  }
  document.getElementById('read-content').innerHTML = `
    <section class="topic-section active">
      <h2>${c.title}</h2>
      <div class="lead">${c.lead}</div>
      ${c.body}
    </section>
  `;
  if (window.renderMathInElement) {
    renderMathInElement(document.getElementById('read-content'), {
      delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
      throwOnError: false
    });
  }
  document.getElementById('read-content').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function selectTopic(id) {
  state.currentTopic = id;
  renderRead();
}

// =================== RENDER QUIZ ===================
function renderQuizFilter() {
  const sel = document.getElementById('quiz-filter');
  sel.innerHTML = '<option value="all">All topics</option>' +
    TOPICS.map(t => `<option value="${t.id}">${t.title.replace(/&amp;/g, '&')}</option>`).join('');
  sel.value = state.quizFilter;
}

function getQuizQuestions() {
  if (state.quizFilter === 'all') return QUIZ;
  return QUIZ.filter(q => q.topic === state.quizFilter);
}

function resetQuizPosition() { state.quizIdx = 0; }

function renderQuiz() {
  const questions = getQuizQuestions();
  const total = questions.length;
  const idx = Math.min(state.quizIdx, total - 1);
  document.getElementById('stat-correct').textContent = state.quizCorrect;
  document.getElementById('stat-wrong').textContent = state.quizWrong;
  document.getElementById('stat-total').textContent = state.quizCorrect + state.quizWrong;
  document.getElementById('stat-max').textContent = total;
  document.getElementById('progress-bar').style.width = `${total === 0 ? 0 : (idx + 1) / total * 100}%`;

  const container = document.getElementById('quiz-container');
  if (total === 0) {
    container.innerHTML = `<div class="quiz-empty"><h3>No questions for this topic yet.</h3><p>Pick "All topics" or another topic.</p></div>`;
    return;
  }

  const q = questions[idx];
  const topicTitle = (TOPICS.find(t => t.id === q.topic)?.title || '').replace(/&amp;/g, '&');
  const answered = state.quizAnswered.get(quizKey(q));

  let optionsHtml = '';
  if (q.type === 'mc') {
    optionsHtml = q.options.map((opt, i) => {
      let cls = 'quiz-option';
      if (answered) {
        if (i === q.a) cls += ' correct';
        else if (i === answered.choice) cls += ' wrong';
      }
      return `<button class="${cls}" data-choice="${i}" ${answered ? 'disabled' : ''}>
                <span class="marker">${String.fromCharCode(65+i)}</span>
                <span>${opt}</span>
              </button>`;
    }).join('');
  } else {
    optionsHtml = `
      <div class="quiz-input-wrap">
        <input type="text" class="quiz-input" id="num-input" placeholder="Enter a number..." ${answered ? 'disabled' : ''} value="${answered ? answered.choice : ''}">
        <button class="quiz-submit" id="num-submit" ${answered ? 'disabled' : ''}>Submit</button>
      </div>`;
  }

  let feedbackHtml = '';
  if (answered) {
    const correctValue = q.type === 'mc' ? `${String.fromCharCode(65 + q.a)}: ${q.options[q.a]}` : q.a;
    feedbackHtml = `
      <div class="quiz-feedback ${answered.correct ? 'correct' : 'wrong'}">
        <div class="verdict">${answered.correct ? '✓ Correct.' : '✗ Not quite.'}</div>
        <p>${q.expl}</p>
        ${!answered.correct ? `<div class="answer-box">Correct answer: ${correctValue}</div>` : ''}
      </div>`;
  }

  container.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-card-head">
        <span class="quiz-q-num">No. ${idx + 1} / ${total}</span>
        <span class="quiz-q-topic">${topicTitle}</span>
      </div>
      <div class="quiz-question"><p>${q.q}</p></div>
      <div class="quiz-options">${optionsHtml}</div>
      ${feedbackHtml}
      <div class="quiz-nav">
        <button class="quiz-nav-btn" id="prev-q" ${idx === 0 ? 'disabled' : ''}>&larr; Previous</button>
        <button class="quiz-nav-btn" id="next-q" ${idx === total - 1 ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    </div>
  `;

  if (window.renderMathInElement) {
    renderMathInElement(container, {
      delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
      throwOnError: false
    });
  }

  if (q.type === 'mc') {
    document.querySelectorAll('[data-choice]').forEach(btn => {
      btn.addEventListener('click', () => {
        const choice = parseInt(btn.dataset.choice);
        const correct = choice === q.a;
        state.quizAnswered.set(quizKey(q), { choice, correct });
        if (correct) state.quizCorrect++; else state.quizWrong++;
        renderQuiz();
      });
    });
  } else {
    const input = document.getElementById('num-input');
    const submit = document.getElementById('num-submit');
    const submitFn = () => {
      const val = parseFloat(input.value.replace(',', '.'));
      if (isNaN(val)) return;
      const correct = Math.abs(val - q.a) <= q.tol;
      state.quizAnswered.set(quizKey(q), { choice: val, correct });
      if (correct) state.quizCorrect++; else state.quizWrong++;
      renderQuiz();
    };
    submit?.addEventListener('click', submitFn);
    input?.addEventListener('keydown', e => { if (e.key === 'Enter') submitFn(); });
    input?.focus();
  }

  document.getElementById('prev-q')?.addEventListener('click', () => {
    if (state.quizIdx > 0) { state.quizIdx--; renderQuiz(); }
  });
  document.getElementById('next-q')?.addEventListener('click', () => {
    if (state.quizIdx < total - 1) { state.quizIdx++; renderQuiz(); }
  });
}

function quizKey(q) { return `${q.topic}:${q.q}`; }

// =================== RENDER FLASHCARDS ===================
function renderFlashFilter() {
  const sel = document.getElementById('flash-filter');
  if (!sel) return;
  sel.innerHTML = '<option value="all">All topics</option>' +
    TOPICS.map(t => `<option value="${t.id}">${t.title.replace(/&amp;/g, '&')}</option>`).join('');
  sel.value = state.flashFilter;
}

function getFlashCards() {
  if (state.flashFilter === 'all') return FLASHCARDS;
  return FLASHCARDS.filter(c => c.topic === state.flashFilter);
}

function flashKey(card) { return `${card.topic}:${card.front}`; }

function renderFlash() {
  const cards = getFlashCards();
  const total = cards.length;
  const idx = total === 0 ? 0 : Math.min(state.flashIdx, total - 1);

  let knowCount = 0, dontCount = 0;
  cards.forEach(c => {
    const v = state.flashAnswered.get(flashKey(c));
    if (v === 'know') knowCount++;
    else if (v === 'dontknow') dontCount++;
  });
  const remaining = total - knowCount - dontCount;
  document.getElementById('flash-know').textContent = knowCount;
  document.getElementById('flash-dontknow').textContent = dontCount;
  document.getElementById('flash-remaining').textContent = remaining;
  document.getElementById('flash-progress-bar').style.width =
    total === 0 ? '0%' : `${((knowCount + dontCount) / total) * 100}%`;

  if (total === 0) {
    document.getElementById('flash-front').textContent = 'No cards for this topic.';
    document.getElementById('flash-back').textContent = '—';
    document.getElementById('flash-num').textContent = '0/0';
    document.getElementById('flash-num-b').textContent = '0/0';
    document.getElementById('flash-topic').textContent = '—';
    document.getElementById('flash-topic-b').textContent = '—';
    return;
  }

  const card = cards[idx];
  const topicTitle = (TOPICS.find(t => t.id === card.topic)?.title || '').replace(/&amp;/g, '&');
  document.getElementById('flash-num').textContent = `No. ${idx + 1}/${total}`;
  document.getElementById('flash-num-b').textContent = `No. ${idx + 1}/${total}`;
  document.getElementById('flash-topic').textContent = topicTitle;
  document.getElementById('flash-topic-b').textContent = topicTitle;
  document.getElementById('flash-front').innerHTML = card.front;
  document.getElementById('flash-back').innerHTML = card.back;

  const cardEl = document.getElementById('flash-card');
  cardEl.classList.toggle('flipped', state.flashFlipped);

  if (window.renderMathInElement) {
    setTimeout(() => {
      try {
        renderMathInElement(document.getElementById('flash-front'), {
          delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
          throwOnError: false
        });
        renderMathInElement(document.getElementById('flash-back'), {
          delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
          throwOnError: false
        });
      } catch (e) { console.error('KaTeX render error:', e); }
    }, 0);
  }

  document.getElementById('flash-prev').disabled = idx === 0;
  document.getElementById('flash-next').disabled = idx === total - 1;

  const ans = state.flashAnswered.get(flashKey(card));
  document.getElementById('flash-yes').style.opacity = ans === 'know' ? '0.5' : '1';
  document.getElementById('flash-no').style.opacity = ans === 'dontknow' ? '0.5' : '1';
}

// =================== VIEW SWITCHING ===================
function switchView(name) {
  state.view = name;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(`view-${name}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });
  if (name === 'read') renderRead();
  if (name === 'quiz') renderQuiz();
  if (name === 'flash') renderFlash();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =================== INIT ===================
document.addEventListener('DOMContentLoaded', () => {
  renderPlan();
  renderQuizFilter();

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  document.getElementById('quiz-filter').addEventListener('change', e => {
    state.quizFilter = e.target.value;
    resetQuizPosition();
    renderQuiz();
  });

  document.getElementById('quiz-reset').addEventListener('click', () => {
    state.quizAnswered.clear();
    state.quizCorrect = 0;
    state.quizWrong = 0;
    state.quizIdx = 0;
    renderQuiz();
  });

  renderFlashFilter();

  document.getElementById('flash-filter').addEventListener('change', e => {
    state.flashFilter = e.target.value;
    state.flashIdx = 0;
    state.flashFlipped = false;
    renderFlash();
  });

  document.getElementById('flash-card').addEventListener('click', () => {
    state.flashFlipped = !state.flashFlipped;
    document.getElementById('flash-card').classList.toggle('flipped');
  });

  document.getElementById('flash-prev').addEventListener('click', () => {
    if (state.flashIdx > 0) {
      state.flashIdx--;
      state.flashFlipped = false;
      renderFlash();
    }
  });

  document.getElementById('flash-next').addEventListener('click', () => {
    const total = getFlashCards().length;
    if (state.flashIdx < total - 1) {
      state.flashIdx++;
      state.flashFlipped = false;
      renderFlash();
    }
  });

  document.getElementById('flash-yes').addEventListener('click', e => {
    e.stopPropagation();
    const cards = getFlashCards();
    if (cards.length === 0) return;
    state.flashAnswered.set(flashKey(cards[state.flashIdx]), 'know');
    if (state.flashIdx < cards.length - 1) {
      state.flashIdx++;
      state.flashFlipped = false;
    }
    renderFlash();
  });

  document.getElementById('flash-no').addEventListener('click', e => {
    e.stopPropagation();
    const cards = getFlashCards();
    if (cards.length === 0) return;
    state.flashAnswered.set(flashKey(cards[state.flashIdx]), 'dontknow');
    if (state.flashIdx < cards.length - 1) {
      state.flashIdx++;
      state.flashFlipped = false;
    }
    renderFlash();
  });

  document.getElementById('flash-reset').addEventListener('click', () => {
    state.flashAnswered.clear();
    state.flashIdx = 0;
    state.flashFlipped = false;
    renderFlash();
  });
});
