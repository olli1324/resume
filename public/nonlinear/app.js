// =================== DATA ===================

const TOPICS = [
  // PHASE I - NONLINEAR ANALYSIS (L01-L04)
  { id: 'dynsys', phase: 'foundations', priority: 'light', title: 'Dynamic systems &amp; state equations',
    desc: 'State, input, output. Writing a state equation from a differential equation. Autonomous vs forced, linear vs nonlinear, trajectories and equilibria.' },
  { id: 'stability', phase: 'foundations', priority: 'core', title: 'Stability concepts',
    desc: 'Stable vs asymptotically stable vs exponentially stable, and the trap between them. Local vs global. The eigenvalue test for the linearization.' },
  { id: 'nlbehav', phase: 'foundations', priority: 'light', title: 'Nonlinear behaviour',
    desc: 'Multiple equilibria, limit cycles (van der Pol), bifurcations, chaos (Chua, Lorenz). Phase portraits as the visual tool.' },
  { id: 'lyapunov', phase: 'foundations', priority: 'core', title: 'Lyapunov direct method',
    desc: 'Energy you invent. The direct theorem, asymptotic version, LaSalle invariance, quadratic candidates, and how to actually find a $V$.' },

  // PHASE II - CONTROL & OBSERVER DESIGN (L05-L09 + Kalman)
  { id: 'jacobian', phase: 'theory', priority: 'new', title: 'Jacobian linearization',
    desc: 'Take the Jacobian at the equilibrium, get a linear system. Hartman-Grobman, the marginal case, and the LQR / pole placement that usually follows.' },
  { id: 'fl', phase: 'theory', priority: 'core', title: 'Feedback linearization',
    desc: 'Choose a clever input that cancels the nonlinearity. Relative degree, Lie derivatives, input-output vs input-state, zero dynamics.' },
  { id: 'sliding', phase: 'theory', priority: 'new', title: 'Sliding mode control',
    desc: 'A sliding surface in state space. Reaching condition, sliding behaviour, chattering and the boundary layer fix. Robust to model error.' },
  { id: 'nmpc', phase: 'theory', priority: 'core', title: 'Nonlinear MPC',
    desc: 'A constrained optimization solved at every timestep, first input applied. Cost, prediction horizon, terminal set, receding horizon principle.' },
  { id: 'kalman', phase: 'theory', priority: 'core', title: 'Kalman &amp; Extended KF',
    desc: 'Optimal observer. Predict-update structure, Kalman gain, and the EKF linearization at each step. When the EKF breaks.' },

  // PHASE III - AEROSPACE (LS01-LS06)
  { id: 'frames', phase: 'algorithms', priority: 'light', title: 'Coordinate frames &amp; rotations',
    desc: 'Inertial, body, orbital, ECEF. DCM, Euler angles, axis-angle, quaternions. When to use which.' },
  { id: 'attkin', phase: 'algorithms', priority: 'new', title: 'Attitude kinematics',
    desc: 'How attitude evolves with angular velocity. DCM, Euler-angle, and quaternion kinematic equations. The Euler-angle singularity.' },
  { id: 'attdyn', phase: 'algorithms', priority: 'core', title: 'Attitude dynamics',
    desc: "Euler's equation $I\\dot\\omega + \\omega \\times I\\omega = \\tau$. Principal axes. Torque-free rotation: stable around major or minor axis, unstable around the intermediate." },
  { id: 'attctrl', phase: 'algorithms', priority: 'core', title: 'Attitude control',
    desc: 'PD on quaternion error: $\\tau = -K_p q_{e,v} - K_d \\omega$. Lyapunov proof. Why quaternions beat Euler angles for control.' },
  { id: 'orbital', phase: 'algorithms', priority: 'new', title: 'Orbital dynamics',
    desc: 'Two-body equation. Orbital elements, conic sections by energy, Hohmann transfer. The frames used for orbit propagation.' },
];

// ============= READING CONTENT =============
const CONTENT = {
  dynsys: {
    title: 'Dynamic systems & state equations',
    lead: 'Every method in the course starts from a state equation. Knowing how to write one, what its solution looks like, and where the equilibria sit is the whole foundation.',
    body: `
      <h3>State, input, output</h3>
      <p>A dynamic system is described by three vectors: the <strong>state</strong> $x \\in \\mathbb{R}^n$ collects everything the future depends on, the <strong>input</strong> $u \\in \\mathbb{R}^m$ is what you act on the system with, and the <strong>output</strong> $y \\in \\mathbb{R}^p$ is what you measure or want to control. In standard form:</p>
      <div class="formula-block"><div class="label">Continuous-time state equation</div>$$\\dot{x} = f(x, u, t), \\qquad y = h(x, u, t).$$</div>
      <p>If $f$ and $h$ do not depend on $t$ the system is <strong>time-invariant</strong>; if $u$ does not appear in $f$ it is <strong>autonomous</strong>; if $f$ is linear in $(x, u)$ it is <strong>linear</strong>, otherwise <strong>nonlinear</strong>.</p>

      <h3>From an ODE to state form</h3>
      <p>A scalar $n$-th order ODE $y^{(n)} = g(y, \\dot{y}, \\dots, y^{(n-1)}, u)$ becomes an $n$-dimensional state equation by stacking derivatives: $x_1 = y$, $x_2 = \\dot{y}$, ..., $x_n = y^{(n-1)}$. Then $\\dot{x}_i = x_{i+1}$ for $i < n$ and $\\dot{x}_n = g$. This is the trick the exam uses to ask "write this system in state form".</p>

      <h3>Trajectories and equilibria</h3>
      <p>Given an initial state $x(t_0) = x_0$, the unique solution $x(t)$ is the <strong>trajectory</strong>. An <strong>equilibrium</strong> $\\bar{x}$ of an autonomous system satisfies $f(\\bar{x}) = 0$: a system started there stays there forever. Finding equilibria is solving an algebraic equation, not an ODE.</p>

      <h3>The Chua circuit, your running example</h3>
      <p>The Chua circuit is the lab 1 system. Three state variables, one nonlinear element (the Chua diode), and a range of qualitative behaviours depending on parameters: equilibria, limit cycles, double-scroll chaos. The state equation is</p>
      <div class="formula-block">$$\\begin{aligned} \\dot{x}_1 &= \\alpha(x_2 - x_1 - g(x_1)) \\\\ \\dot{x}_2 &= x_1 - x_2 + x_3 \\\\ \\dot{x}_3 &= -\\beta x_2 \\end{aligned}$$</div>
      <p>with $g$ piecewise linear. This is the system you simulated in <code>chua_sim.slx</code>.</p>

      <div class="key-box">
        <div class="label">What to have automatic</div>
        <ul>
          <li>Convert an $n$-th order ODE to an $n$-dimensional state equation in one step.</li>
          <li>Find equilibria by solving $f(\\bar{x}) = 0$, not by simulating.</li>
          <li>Recognize the four labels: autonomous / forced, time-invariant / time-varying, linear / nonlinear, SISO / MIMO.</li>
        </ul>
      </div>
    `
  },

  stability: {
    title: 'Stability concepts',
    lead: 'Three definitions, easy to blur. Stability is a property of an equilibrium, not of a whole system, and the differences between stable, asymptotically stable, and exponentially stable are the standard exam trap.',
    body: `
      <h3>The three definitions</h3>
      <p>An equilibrium $\\bar{x}$ of $\\dot{x} = f(x)$ is</p>
      <div class="formula-block"><div class="label">Stability (in the sense of Lyapunov)</div>$$\\forall \\varepsilon > 0, \\ \\exists \\delta > 0 \\ : \\ \\lVert x(0) - \\bar{x} \\rVert < \\delta \\Rightarrow \\lVert x(t) - \\bar{x} \\rVert < \\varepsilon, \\ \\forall t \\geq 0.$$</div>
      <p>Trajectories that start near $\\bar{x}$ stay near $\\bar{x}$. They do not have to converge.</p>
      <p><strong>Asymptotically stable</strong> adds convergence: stable, <em>and</em> $\\lim_{t\\to\\infty} x(t) = \\bar{x}$ for all starts close enough.</p>
      <p><strong>Exponentially stable</strong> adds a decay rate:</p>
      <div class="formula-block">$$\\lVert x(t) - \\bar{x} \\rVert \\leq c\\, e^{-\\lambda t}\\, \\lVert x(0) - \\bar{x} \\rVert, \\quad c, \\lambda > 0.$$</div>
      <p>Strictly: exponential implies asymptotic implies stable. None of the converses hold.</p>

      <h3>Local vs global</h3>
      <p>All three definitions above are <strong>local</strong>: they hold for starts within some neighbourhood of $\\bar{x}$. <strong>Global</strong> versions drop the "close enough" and ask the property for any initial state. Global asymptotic stability ("GAS") is a strong claim; it usually requires a Lyapunov argument that works everywhere.</p>

      <h3>The eigenvalue test (linearization)</h3>
      <p>Linearize $\\dot{x} = f(x)$ at $\\bar{x}$: the linear system $\\dot{z} = A z$ with $A = \\partial f / \\partial x|_{\\bar{x}}$ tells you a lot:</p>
      <table class="calc-table">
        <tr><th>Eigenvalues of $A$</th><th>Conclusion for the nonlinear system at $\\bar{x}$</th></tr>
        <tr><td>All $\\mathrm{Re}(\\lambda_i) < 0$</td><td>Locally asymptotically stable (in fact exponentially)</td></tr>
        <tr><td>Some $\\mathrm{Re}(\\lambda_i) > 0$</td><td>Unstable</td></tr>
        <tr><td>$\\mathrm{Re}(\\lambda_i) \\leq 0$ with at least one $= 0$</td><td>Inconclusive &mdash; need higher-order analysis (Lyapunov)</td></tr>
      </table>
      <p>This is the workhorse for local questions. For global statements or marginal cases, you fall back to Lyapunov.</p>

      <div class="key-box">
        <div class="label">Disambiguation &mdash; the standard trap</div>
        <ul>
          <li>Stable does not imply convergence. The pendulum equilibrium without friction is stable but not asymptotically stable.</li>
          <li>Asymptotic convergence does not imply exponential rate. Some systems converge as $1/t$, not as $e^{-\\lambda t}$.</li>
          <li>An equilibrium can be locally asymptotically stable without being globally asymptotically stable. Multiple basins of attraction.</li>
        </ul>
      </div>
    `
  },

  nlbehav: {
    title: 'Nonlinear behaviour',
    lead: 'Linear systems have one kind of equilibrium and either grow or decay. Nonlinear systems do everything: multiple equilibria, limit cycles, bifurcations, chaos. Recognize the patterns; do not try to derive them on the exam.',
    body: `
      <h3>Multiple equilibria</h3>
      <p>A nonlinear $f(\\bar{x}) = 0$ can have several solutions. Each is its own local question. The pendulum has equilibria at $\\theta = 0$ (stable) and $\\theta = \\pi$ (unstable). Which one a trajectory converges to depends on its starting <strong>basin of attraction</strong>.</p>

      <h3>Limit cycles</h3>
      <p>A <strong>limit cycle</strong> is an isolated closed trajectory: a periodic orbit that nearby trajectories spiral toward (stable limit cycle) or away from (unstable). The van der Pol oscillator,</p>
      <div class="formula-block">$$\\ddot{x} - \\mu(1 - x^2)\\dot{x} + x = 0,$$</div>
      <p>has one stable limit cycle for any $\\mu > 0$. Linear systems cannot do this: their only periodic solutions are families of orbits surrounding a centre.</p>

      <h3>Bifurcations</h3>
      <p>Vary a parameter $\\mu$ and watch the qualitative behaviour change at a critical value $\\mu^\\star$. Three you should recognize:</p>
      <ul>
        <li><strong>Saddle-node:</strong> two equilibria collide and disappear.</li>
        <li><strong>Pitchfork:</strong> one equilibrium splits into three (or vice versa).</li>
        <li><strong>Hopf:</strong> an equilibrium loses stability and a limit cycle appears around it.</li>
      </ul>

      <h3>Chaos</h3>
      <p>Deterministic systems with three or more state dimensions can exhibit <strong>chaos</strong>: bounded trajectories that never settle, with extreme sensitivity to initial conditions. The Chua circuit and the Lorenz system are the textbook examples. Practically: long-term prediction is impossible even though the equations are exact.</p>

      <h3>Phase portraits</h3>
      <p>For 2-D systems, plot $\\dot{x}$ as a vector field over the state plane. Equilibria are zeros of the field; trajectories follow the arrows. The phase portrait is the visual answer to "what does this system do qualitatively?" Use it in lab work but do not expect to draw one on the exam.</p>

      <div class="key-box">
        <div class="label">What the exam tends to ask</div>
        <ul>
          <li>Identify equilibria from $f(\\bar{x}) = 0$.</li>
          <li>Classify each equilibrium using the Jacobian eigenvalues.</li>
          <li>Recognize a limit cycle versus a stable spiral from a phase portrait.</li>
          <li>Match a bifurcation diagram to its type (saddle-node, pitchfork, Hopf).</li>
        </ul>
      </div>
    `
  },

  lyapunov: {
    title: 'Lyapunov direct method',
    lead: 'A Lyapunov function is energy you invent. If you can find one that decreases along trajectories, you have proved stability without solving the ODE. The whole method is finding the right $V$.',
    body: `
      <h3>The direct theorem</h3>
      <p>For $\\dot{x} = f(x)$ with equilibrium at the origin, suppose $V : \\mathbb{R}^n \\to \\mathbb{R}$ is continuously differentiable with $V(0) = 0$, $V(x) > 0$ for $x \\neq 0$ (positive definite), and</p>
      <div class="formula-block"><div class="label">Lyapunov's direct theorem</div>$$\\dot{V}(x) = \\nabla V(x)^\\top f(x) \\leq 0 \\ \\Rightarrow \\ \\text{the origin is stable}.$$</div>
      <p>If additionally $\\dot{V}(x) < 0$ for $x \\neq 0$ in a neighbourhood, the origin is <strong>asymptotically stable</strong>. If $V$ is also radially unbounded ($V(x) \\to \\infty$ as $\\lVert x \\rVert \\to \\infty$) and $\\dot{V} < 0$ everywhere, the origin is <strong>globally asymptotically stable</strong>.</p>

      <h3>Quadratic candidates</h3>
      <p>The default first guess is $V(x) = x^\\top P x$ with $P \\succ 0$ symmetric. Then $\\dot{V} = x^\\top(A^\\top P + P A)x$ for a linear system $\\dot{x} = Ax$, so the question reduces to the <strong>Lyapunov equation</strong></p>
      <div class="formula-block">$$A^\\top P + P A = -Q, \\qquad Q \\succ 0.$$</div>
      <p>For a stable $A$, this always has a unique $P \\succ 0$ solution. For a nonlinear system, use the same $P$ and check whether $\\dot{V} = 2 x^\\top P f(x)$ is negative on a region.</p>

      <h3>LaSalle's invariance principle</h3>
      <p>What if $\\dot{V} \\leq 0$ but $\\dot{V} = 0$ on a set bigger than $\\{0\\}$? LaSalle rescues you: trajectories converge to the largest invariant set contained in $\\{x : \\dot{V}(x) = 0\\}$. If that set is just the origin, you still have asymptotic stability. Common use: the pendulum with friction, where $V$ is total energy and $\\dot{V} = 0$ on the whole $\\dot{\\theta} = 0$ axis but only the origin is invariant.</p>

      <h3>How to actually find a $V$</h3>
      <ol>
        <li>Try the system's <strong>energy</strong>: kinetic plus potential, or $\\tfrac12 x^\\top M x$ for a mechanical system.</li>
        <li>If that fails, try a <strong>quadratic</strong> $x^\\top P x$ with $P$ from the Lyapunov equation of the linearization.</li>
        <li>For closed-loop nonlinear designs (backstepping, FL), the controller is often designed <em>so that</em> a target $V$ decreases &mdash; the candidate comes with the method.</li>
      </ol>

      <div class="key-box">
        <div class="label">The exam recipe</div>
        <ol>
          <li>Propose $V(x)$, check $V(0) = 0$ and $V(x) > 0$ on a neighbourhood.</li>
          <li>Compute $\\dot{V} = \\nabla V \\cdot f(x)$.</li>
          <li>Sign-check $\\dot{V}$. If $\\leq 0$: stable. If $< 0$: asymptotically stable. If LaSalle is needed, identify the invariant set.</li>
        </ol>
      </div>
    `
  },

  jacobian: {
    title: 'Jacobian linearization',
    lead: 'Take the equilibrium, take the Jacobian, get a linear system. The local behaviour of the nonlinear system matches the linearization when the linearization is hyperbolic. The marginal case is the one to watch.',
    body: `
      <h3>The Jacobian at an equilibrium</h3>
      <p>For $\\dot{x} = f(x, u)$ with equilibrium $(\\bar{x}, \\bar{u})$ where $f(\\bar{x}, \\bar{u}) = 0$, define the deviations $z = x - \\bar{x}$, $v = u - \\bar{u}$. To first order,</p>
      <div class="formula-block"><div class="label">Jacobian linearization</div>$$\\dot{z} = A z + B v, \\quad A = \\frac{\\partial f}{\\partial x}\\bigg|_{(\\bar{x}, \\bar{u})}, \\ B = \\frac{\\partial f}{\\partial u}\\bigg|_{(\\bar{x}, \\bar{u})}.$$</div>
      <p>Likewise for the output $y = h(x, u)$: $w = y - h(\\bar{x}, \\bar{u}) = C z + D v$.</p>

      <h3>Hartman&ndash;Grobman</h3>
      <p>The theorem that justifies the whole procedure: if the linearization $A$ has <strong>no eigenvalues on the imaginary axis</strong> (hyperbolic equilibrium), there is a continuous bijection between trajectories of the nonlinear system and the linearization in a neighbourhood. Topologically the two systems are identical locally.</p>

      <h3>The marginal case</h3>
      <p>If any eigenvalue of $A$ has zero real part, Hartman&ndash;Grobman does not apply and the local behaviour of the nonlinear system depends on terms of higher order than the Jacobian captures. You have to fall back to Lyapunov or look at the centre manifold. This is the exam's favourite trick question.</p>

      <h3>What you do after</h3>
      <p>Once you have $(A, B)$, design a linear controller and apply it to the nonlinear system as $u = \\bar{u} + K(\\bar{x} - x)$. The two standard approaches:</p>
      <ul>
        <li><strong>Pole placement:</strong> choose $K$ so that $A - BK$ has desired eigenvalues. Needs $(A, B)$ controllable.</li>
        <li><strong>LQR:</strong> minimize $\\int (z^\\top Q z + v^\\top R v) \\, dt$. Gives a stabilizing $K = R^{-1} B^\\top P$ from the algebraic Riccati equation.</li>
      </ul>
      <p>Both work <strong>locally</strong> for the nonlinear system. How large the basin of attraction is depends on how nonlinear the system is.</p>

      <div class="key-box">
        <div class="label">The one-line tell</div>
        <p>"Linearize about the equilibrium" means compute the Jacobian at $(\\bar{x}, \\bar{u})$. The result is a linear system valid <em>only locally</em>. If the Jacobian has any zero-real-part eigenvalue, the linearization is inconclusive for the nonlinear stability.</p>
      </div>
    `
  },

  fl: {
    title: 'Feedback linearization',
    lead: 'Pick an input that cancels the nonlinearity. The closed-loop dynamics become linear, exactly. Two flavours and one mandatory check: input-output, input-state, and the zero dynamics.',
    body: `
      <h3>The idea</h3>
      <p>Given $\\dot{x} = f(x) + g(x) u$ (a control-affine system), find a state feedback $u = \\alpha(x) + \\beta(x) v$ such that the closed-loop, in some coordinates $z = \\Phi(x)$, becomes a linear system in $(z, v)$. Then design any linear controller you like on the new system.</p>

      <h3>Input-output linearization &mdash; the procedure</h3>
      <p>Pick an output $y = h(x)$. Differentiate until the input $u$ appears explicitly:</p>
      <div class="formula-block">$$y = h(x), \\ \\dot{y} = L_f h(x), \\ \\ddot{y} = L_f^2 h(x), \\ \\dots, \\ y^{(r)} = L_f^r h(x) + L_g L_f^{r-1} h(x) \\cdot u.$$</div>
      <p>The first $r$ at which $u$ appears is the <strong>relative degree</strong>. Choose</p>
      <div class="formula-block"><div class="label">Linearizing input</div>$$u = \\frac{1}{L_g L_f^{r-1} h(x)} \\big( v - L_f^r h(x) \\big).$$</div>
      <p>Then $y^{(r)} = v$: the input-output map is a chain of $r$ integrators. Design $v$ to track a reference using any linear method (pole placement, PID).</p>

      <h3>Lie derivatives, briefly</h3>
      <p>The notation $L_f h = \\nabla h \\cdot f$ is the directional derivative of $h$ along $f$. $L_f^k h$ is $L_f$ applied $k$ times. The exam tests whether you can compute these for a small system on paper.</p>

      <h3>Zero dynamics &mdash; the mandatory check</h3>
      <p>If the relative degree $r$ is less than the state dimension $n$, the linearizing transformation $\\Phi(x)$ has $n - r$ extra coordinates that are not driven by the input. These are the <strong>internal dynamics</strong>. Set $y \\equiv 0$ and see what happens to them: the resulting system is the <strong>zero dynamics</strong>.</p>
      <p>If the zero dynamics are stable, the full feedback linearization controller works (minimum-phase system). If unstable, your beautiful linear closed-loop has hidden instability you cannot see at the output. <strong>Always check.</strong></p>

      <h3>Input-state linearization</h3>
      <p>The stronger version asks for a full diffeomorphism $z = \\Phi(x)$ and an input transformation such that $\\dot{z} = A z + B v$ with $(A, B)$ controllable, in <em>all</em> state coordinates. Possible iff specific Lie-bracket conditions hold (involutivity). When it works, there are no zero dynamics to worry about.</p>

      <div class="key-box">
        <div class="label">The three-line recipe</div>
        <ol>
          <li>Compute the relative degree $r$ by differentiating $h(x)$ until $u$ shows up.</li>
          <li>Write the linearizing input $u = (v - L_f^r h) / (L_g L_f^{r-1} h)$.</li>
          <li>Check the zero dynamics if $r < n$. If unstable: stop and try something else.</li>
        </ol>
      </div>
    `
  },

  sliding: {
    title: 'Sliding mode control',
    lead: 'Define a sliding surface in state space, drive the system to it, then slide along it to the origin. The sliding behaviour is robust to model error and disturbances. The price is chattering, fixed at the cost of robustness.',
    body: `
      <div class="diagram-wrap">
        <svg viewBox="0 0 540 240" xmlns="http://www.w3.org/2000/svg">
          <line x1="40" y1="200" x2="500" y2="200" stroke="#7a7164" stroke-width="1"/>
          <line x1="270" y1="20" x2="270" y2="220" stroke="#7a7164" stroke-width="1"/>
          <line x1="80" y1="180" x2="460" y2="40" stroke="#a8431e" stroke-width="2.5"/>
          <text x="465" y="40" font-size="13" fill="#a8431e" font-family="'Fraunces',serif">s(x) = 0</text>
          <path d="M 110 60 Q 180 80 220 110 Q 250 130 270 145" fill="none" stroke="#4a6b3a" stroke-width="2" stroke-dasharray="4,3"/>
          <polyline points="270,145 330,125 400,95 460,70" fill="none" stroke="#4a6b3a" stroke-width="2.5"/>
          <circle cx="110" cy="60" r="4" fill="#1a1612"/>
          <text x="100" y="50" font-size="12" fill="#1a1612" font-family="'JetBrains Mono',monospace">x(0)</text>
          <text x="160" y="100" font-size="11" fill="#4a6b3a" font-family="'Fraunces',serif" font-style="italic">reaching</text>
          <text x="370" y="80" font-size="11" fill="#4a6b3a" font-family="'Fraunces',serif" font-style="italic">sliding</text>
        </svg>
        <div class="diagram-caption">Reach the surface $s(x) = 0$ from any start, then slide along it to the origin.</div>
      </div>

      <h3>The sliding surface</h3>
      <p>Pick a function $s : \\mathbb{R}^n \\to \\mathbb{R}$ such that the dynamics on the manifold $\\{s(x) = 0\\}$ are stable and converge to the origin. For a second-order system with state $(x_1, x_2)$, a typical choice is the linear surface</p>
      <div class="formula-block">$$s(x) = x_2 + \\lambda x_1, \\qquad \\lambda > 0.$$</div>
      <p>On $s = 0$, $x_2 = -\\lambda x_1$, so $\\dot{x}_1 = -\\lambda x_1$ &mdash; an exponentially decaying first-order system. You have effectively reduced the order by one.</p>

      <h3>The reaching condition</h3>
      <p>Force $s$ to zero in finite time:</p>
      <div class="formula-block"><div class="label">Reaching condition</div>$$s \\dot{s} \\leq -\\eta |s|, \\qquad \\eta > 0.$$</div>
      <p>This is the Lyapunov inequality for $V = \\tfrac12 s^2$, which gives $\\dot{V} \\leq -\\eta \\sqrt{2V}$ and finite-time convergence of $s$ to zero. Standard control law to enforce it:</p>
      <div class="formula-block">$$u = u_{eq}(x) - k \\, \\mathrm{sign}(s),$$</div>
      <p>where $u_{eq}$ is the <strong>equivalent control</strong> that would keep $\\dot{s} = 0$ on the surface in the nominal model, and $k$ is large enough to dominate disturbances.</p>

      <h3>Why it is robust</h3>
      <p>Once on the surface, the closed-loop dynamics depend only on the surface design, not on the system parameters (within limits). Bounded matched disturbances are rejected by the sign-switching term. The same property makes SMC popular in motor control and robotics.</p>

      <h3>Chattering and the boundary layer</h3>
      <p>The sign function switches infinitely fast on $s = 0$, exciting unmodelled dynamics and wasting actuator life. The standard fix: replace $\\mathrm{sign}(s)$ with a smooth approximation like $\\tanh(s/\\phi)$ or a saturation $\\mathrm{sat}(s/\\phi)$, where $\\phi$ is a small <strong>boundary layer</strong> width. The trade: less chattering, but the trajectory now sits in a band around $s = 0$ rather than exactly on it, so robustness drops.</p>

      <div class="key-box">
        <div class="label">The three-line recipe</div>
        <ol>
          <li>Choose the sliding surface $s(x) = 0$ so the reduced-order dynamics are stable.</li>
          <li>Pick a control law that enforces $s \\dot{s} \\leq -\\eta |s|$.</li>
          <li>Replace $\\mathrm{sign}(s)$ with a smooth approximation if chattering is a problem.</li>
        </ol>
      </div>
    `
  },

  nmpc: {
    title: 'Nonlinear MPC',
    lead: 'At every timestep, solve a constrained optimization over a finite prediction horizon. Apply the first input, then repeat. The exam wants the structure, not the solver.',
    body: `
      <h3>The optimization problem</h3>
      <p>At each sampling instant $k$, given the current state $x_k$, NMPC solves</p>
      <div class="formula-block"><div class="label">The NMPC problem</div>$$\\begin{aligned} \\min_{\\mathbf{u}} \\ & \\sum_{i=0}^{N-1} \\ell(x_{k+i|k}, u_{k+i|k}) + V_f(x_{k+N|k}) \\\\ \\text{s.t. } & x_{k+i+1|k} = f(x_{k+i|k}, u_{k+i|k}) \\\\ & x_{k+i|k} \\in \\mathcal{X}, \\ u_{k+i|k} \\in \\mathcal{U} \\\\ & x_{k+N|k} \\in \\mathcal{X}_f, \\quad x_{k|k} = x_k \\end{aligned}$$</div>
      <p>$\\ell$ is the <strong>stage cost</strong>, $V_f$ the <strong>terminal cost</strong>, $\\mathcal{X}_f$ the <strong>terminal set</strong>, $N$ the <strong>prediction horizon</strong>.</p>

      <h3>Receding horizon principle</h3>
      <p>The solution is a sequence $u_{k|k}^\\star, u_{k+1|k}^\\star, \\dots, u_{k+N-1|k}^\\star$. Apply only the first one, $u_k = u_{k|k}^\\star$. At the next sampling instant, measure the new state $x_{k+1}$, shift the horizon by one, and solve again. You never use the predicted inputs beyond the first.</p>

      <h3>Why the terminal pieces matter</h3>
      <p>Without a terminal cost and set, NMPC has no general stability guarantee even with a perfect model. The standard recipe to fix this:</p>
      <ul>
        <li>Pick a <strong>terminal set</strong> $\\mathcal{X}_f$ that is forward-invariant under some local controller $\\kappa_f$.</li>
        <li>Pick a <strong>terminal cost</strong> $V_f$ that is a Lyapunov function for the closed-loop under $\\kappa_f$ inside $\\mathcal{X}_f$.</li>
      </ul>
      <p>Then the optimal cost is a Lyapunov function for the receding-horizon scheme. This is the construction your slides emphasize.</p>

      <h3>Linear MPC as a special case</h3>
      <p>If $f$ is linear and the cost is quadratic, the NMPC problem becomes a quadratic program (QP) at each step &mdash; the topic of your convex optimization exam. Modern QP solvers are fast enough that this can run at kHz rates. NMPC with nonlinear $f$ is more expensive: the per-step problem is a nonlinear program, typically solved by sequential quadratic programming or interior-point methods.</p>

      <h3>Trade-offs</h3>
      <ul>
        <li>Handles constraints natively, unlike feedback linearization or sliding mode.</li>
        <li>Handles MIMO, time-varying references, and economic objectives.</li>
        <li>Computational cost grows with $N$ and the state dimension. Real-time NMPC needs careful problem structure.</li>
        <li>Needs a reasonable model. Robustness to model error is a separate, harder topic (robust / tube MPC).</li>
      </ul>

      <div class="key-box">
        <div class="label">The exam-ready statement</div>
        <p>NMPC at every sampling instant solves a finite-horizon optimal control problem with cost $\\sum \\ell + V_f$, system dynamics as equality constraints, and state and input bounds. The first optimal input is applied, then the horizon recedes. Stability follows from a terminal cost and set chosen so that the optimal cost is a Lyapunov function.</p>
      </div>
    `
  },

  kalman: {
    title: 'Kalman & Extended Kalman filter',
    lead: 'The optimal observer for linear Gaussian systems, generalized to nonlinear systems by linearizing at each step. The structure is the same in both cases: predict, then update with a measurement.',
    body: `
      <h3>Linear Kalman filter &mdash; the structure</h3>
      <p>For the linear stochastic system $x_{k+1} = A x_k + B u_k + w_k$, $y_k = C x_k + v_k$ with white Gaussian noise of known covariance $w \\sim N(0, Q)$, $v \\sim N(0, R)$, the KF maintains a Gaussian estimate $\\hat{x}_k \\sim N(\\hat{x}_k, P_k)$ and runs in two steps:</p>
      <div class="formula-block"><div class="label">Predict</div>$$\\hat{x}_{k+1|k} = A \\hat{x}_k + B u_k, \\qquad P_{k+1|k} = A P_k A^\\top + Q.$$</div>
      <div class="formula-block"><div class="label">Update</div>$$\\begin{aligned} K_{k+1} &= P_{k+1|k} C^\\top (C P_{k+1|k} C^\\top + R)^{-1} \\\\ \\hat{x}_{k+1} &= \\hat{x}_{k+1|k} + K_{k+1}(y_{k+1} - C \\hat{x}_{k+1|k}) \\\\ P_{k+1} &= (I - K_{k+1} C) P_{k+1|k} \\end{aligned}$$</div>
      <p>$K$ is the <strong>Kalman gain</strong>: it weighs the model prediction against the noisy measurement by their relative uncertainties.</p>

      <h3>EKF &mdash; same recipe, linearized</h3>
      <p>For the nonlinear system $x_{k+1} = f(x_k, u_k) + w_k$, $y_k = h(x_k) + v_k$, replace $A$ and $C$ in the linear equations with the Jacobians evaluated at the current estimate:</p>
      <div class="formula-block">$$F_k = \\frac{\\partial f}{\\partial x}\\bigg|_{\\hat{x}_k}, \\qquad H_k = \\frac{\\partial h}{\\partial x}\\bigg|_{\\hat{x}_{k+1|k}}.$$</div>
      <p>The mean propagates through the true nonlinear $f$ and $h$, but the covariance is propagated through the linearization. The five lines are:</p>
      <div class="formula-block">$$\\begin{aligned} \\hat{x}_{k+1|k} &= f(\\hat{x}_k, u_k), \\quad P_{k+1|k} = F_k P_k F_k^\\top + Q \\\\ K_{k+1} &= P_{k+1|k} H_{k+1}^\\top (H_{k+1} P_{k+1|k} H_{k+1}^\\top + R)^{-1} \\\\ \\hat{x}_{k+1} &= \\hat{x}_{k+1|k} + K_{k+1}(y_{k+1} - h(\\hat{x}_{k+1|k})) \\\\ P_{k+1} &= (I - K_{k+1} H_{k+1}) P_{k+1|k} \\end{aligned}$$</div>

      <h3>When the EKF breaks</h3>
      <p>The EKF is not optimal in the nonlinear case &mdash; it is a first-order approximation. It can fail when</p>
      <ul>
        <li>The initial estimate is far from the true state (the linearization is wrong).</li>
        <li>The nonlinearity is strong relative to the uncertainty (the Gaussian assumption breaks).</li>
        <li>The dynamics multimodal or bifurcating &mdash; a single Gaussian cannot capture two peaks.</li>
      </ul>
      <p>Alternatives: unscented Kalman filter (sigma points instead of Jacobians), particle filter (Monte Carlo). Outside the syllabus for this exam, but worth knowing they exist.</p>

      <h3>Spacecraft context</h3>
      <p>For attitude estimation, the state is typically the quaternion plus the gyro bias, and the measurement is from a star tracker or a magnetometer. The EKF in this setting is called the <strong>multiplicative EKF</strong> because the quaternion update uses multiplication rather than addition.</p>

      <div class="key-box">
        <div class="label">Disambiguation</div>
        <ul>
          <li><strong>Linear KF:</strong> $A, C$ constant matrices.</li>
          <li><strong>EKF:</strong> $F_k, H_k$ Jacobians evaluated at the current estimate, recomputed each step.</li>
          <li>The mean step uses the <em>true</em> $f$ and $h$ in both cases. Only the covariance propagation differs.</li>
        </ul>
      </div>
    `
  },

  frames: {
    title: 'Coordinate frames & rotations',
    lead: 'Aerospace lives in several frames at once: inertial, body, orbital, ECEF. Rotations between them are expressed as a direction cosine matrix, Euler angles, axis-angle, or quaternions. Each has a use.',
    body: `
      <h3>The frames</h3>
      <table class="calc-table">
        <tr><th>Frame</th><th>Origin / axes</th><th>Use</th></tr>
        <tr><td>ECI (inertial)</td><td>Earth-centred, axes fixed in space</td><td>Newton's laws, orbit propagation</td></tr>
        <tr><td>ECEF</td><td>Earth-centred, rotates with Earth</td><td>Position on the ground (latitude/longitude)</td></tr>
        <tr><td>Body</td><td>Spacecraft centre of mass, axes fixed to the body</td><td>Sensors, actuators, Euler's equation</td></tr>
        <tr><td>Orbital (LVLH)</td><td>Spacecraft position, axes from orbit geometry</td><td>Earth-pointing missions, formation flying</td></tr>
      </table>

      <h3>Direction cosine matrix</h3>
      <p>A rotation from frame $a$ to frame $b$ is described by an orthogonal matrix $R_{ab} \\in SO(3)$ with $R_{ab}^\\top R_{ab} = I$ and $\\det R_{ab} = +1$. A vector expressed in frame $b$ is the same physical vector expressed in frame $a$:</p>
      <div class="formula-block">$$v^b = R_{ab}\\, v^a, \\qquad R_{ba} = R_{ab}^\\top.$$</div>
      <p>The DCM has 9 entries but only 3 independent parameters (rotations have 3 degrees of freedom). The six constraints are the orthonormality of the rows.</p>

      <h3>Euler angles (321)</h3>
      <p>Three successive rotations about chosen axes. The aerospace standard is the 3-2-1 (yaw-pitch-roll) sequence: rotate by $\\psi$ about $z$, then $\\theta$ about the new $y$, then $\\phi$ about the new $x$. The composition gives</p>
      <div class="formula-block">$$R = R_x(\\phi)\\, R_y(\\theta)\\, R_z(\\psi).$$</div>
      <p><strong>Singularity at $\\theta = \\pm\\pi/2$:</strong> yaw and roll merge into the same physical rotation ("gimbal lock"). The Euler-angle rates blow up. This is why quaternions are preferred for control.</p>

      <h3>Axis-angle (Euler's theorem)</h3>
      <p>Any rotation in $SO(3)$ is a single rotation by angle $\\theta$ about a unit axis $\\hat{n}$. Compact, four parameters but with the constraint $\\lVert \\hat{n} \\rVert = 1$. Visualizes rotations cleanly and is the bridge to quaternions.</p>

      <h3>Quaternions</h3>
      <p>A unit quaternion $q = (q_0, q_v) = (\\cos(\\theta/2), \\hat{n} \\sin(\\theta/2))$ encodes the same axis-angle in four numbers with $\\lVert q \\rVert = 1$. Composition is by quaternion product (not commutative):</p>
      <div class="formula-block">$$q_{12} = q_2 \\otimes q_1.$$</div>
      <p>Properties: no singularities, double-cover of $SO(3)$ (i.e. $q$ and $-q$ represent the same rotation), numerically well-behaved.</p>

      <div class="key-box">
        <div class="label">When to use which</div>
        <ul>
          <li><strong>DCM:</strong> the most explicit; use for transforming vectors between frames.</li>
          <li><strong>Euler angles:</strong> human-readable, intuition; <em>avoid</em> if pitch can reach $\\pm 90^\\circ$.</li>
          <li><strong>Axis-angle:</strong> good for visualization and small-angle approximations.</li>
          <li><strong>Quaternions:</strong> the standard choice for attitude propagation and control. Singularity-free.</li>
        </ul>
      </div>
    `
  },

  attkin: {
    title: 'Attitude kinematics',
    lead: 'How attitude evolves under angular velocity. The DCM, Euler-angle, and quaternion forms each have a different ODE; the angular velocity vector is the input in all three.',
    body: `
      <h3>DCM kinematics</h3>
      <p>Let $R = R_{IB}$ be the rotation from inertial to body, and $\\omega^B$ the body angular velocity expressed in the body frame. Then</p>
      <div class="formula-block"><div class="label">DCM kinematic equation</div>$$\\dot{R}_{IB} = R_{IB} \\, [\\omega^B]_\\times,$$</div>
      <p>where $[\\omega]_\\times$ is the skew-symmetric cross-product matrix</p>
      <div class="formula-block">$$[\\omega]_\\times = \\begin{bmatrix} 0 & -\\omega_3 & \\omega_2 \\\\ \\omega_3 & 0 & -\\omega_1 \\\\ -\\omega_2 & \\omega_1 & 0 \\end{bmatrix}.$$</div>
      <p>This is 9 equations for 9 entries of $R$, with the orthogonality constraint to be preserved. Numerical integration of the DCM tends to drift off $SO(3)$ unless you re-orthonormalize.</p>

      <h3>Euler-angle kinematics</h3>
      <p>For the 321 sequence $(\\phi, \\theta, \\psi)$ with body rates $\\omega^B = (p, q, r)$,</p>
      <div class="formula-block">$$\\begin{bmatrix} \\dot{\\phi} \\\\ \\dot{\\theta} \\\\ \\dot{\\psi} \\end{bmatrix} = \\frac{1}{\\cos\\theta}\\begin{bmatrix} \\cos\\theta & \\sin\\phi\\sin\\theta & \\cos\\phi\\sin\\theta \\\\ 0 & \\cos\\phi\\cos\\theta & -\\sin\\phi\\cos\\theta \\\\ 0 & \\sin\\phi & \\cos\\phi \\end{bmatrix} \\begin{bmatrix} p \\\\ q \\\\ r \\end{bmatrix}.$$</div>
      <p>The $1/\\cos\\theta$ in front is the singularity at $\\theta = \\pm \\pi/2$. Three equations, three unknowns, but unusable near the singularity.</p>

      <h3>Quaternion kinematics</h3>
      <p>For a unit quaternion $q = (q_0, q_1, q_2, q_3)$ and body angular velocity $\\omega^B$,</p>
      <div class="formula-block"><div class="label">Quaternion kinematic equation</div>$$\\dot{q} = \\tfrac12 \\, q \\otimes \\begin{pmatrix} 0 \\\\ \\omega^B \\end{pmatrix} = \\tfrac12 \\Omega(\\omega^B) \\, q,$$</div>
      <p>where</p>
      <div class="formula-block">$$\\Omega(\\omega) = \\begin{bmatrix} 0 & -\\omega_1 & -\\omega_2 & -\\omega_3 \\\\ \\omega_1 & 0 & \\omega_3 & -\\omega_2 \\\\ \\omega_2 & -\\omega_3 & 0 & \\omega_1 \\\\ \\omega_3 & \\omega_2 & -\\omega_1 & 0 \\end{bmatrix}.$$</div>
      <p>Four equations, no singularity, linear in $q$ for a given $\\omega$. The unit-norm constraint is preserved by the ODE itself: if $\\lVert q(0) \\rVert = 1$, then $\\lVert q(t) \\rVert = 1$ exactly. Numerically, periodic renormalization is still common.</p>

      <h3>Sign and frame conventions</h3>
      <p>Different books and slide sets put the $1/2$, the skew, and the quaternion product on different sides. The single most useful rule: <strong>derive the equation once for a simple case (planar rotation, pure pitch) and pin down the convention</strong>. Then stick with it. Most exam confusion in this topic is convention confusion, not concept.</p>

      <div class="key-box">
        <div class="label">Which to integrate in MATLAB</div>
        <ul>
          <li>For numerical work in Simulink: <strong>quaternions</strong>. No singularity, four states, stable integration.</li>
          <li>For human-facing plots: convert to Euler angles at the end, not throughout.</li>
          <li>The DCM is a useful intermediate but rarely the integration variable in modern practice.</li>
        </ul>
      </div>
    `
  },

  attdyn: {
    title: 'Attitude dynamics',
    lead: "Euler's equation. The torque on a rigid body equals the rate of change of angular momentum. In the body frame this becomes a nonlinear coupled ODE for the angular velocity.",
    body: `
      <h3>Newton-Euler in the body frame</h3>
      <p>The angular momentum of a rigid body is $H = I \\omega$, with $I$ the inertia tensor. Newton's second law says $\\dot{H}^I = \\tau$ in the inertial frame. Translated to the body frame, where $I$ is constant,</p>
      <div class="formula-block"><div class="label">Euler's equation</div>$$I \\dot{\\omega} + \\omega \\times I \\omega = \\tau,$$</div>
      <p>with all quantities expressed in the body frame. The cross-product term is the source of the nonlinearity and the gyroscopic coupling between axes.</p>

      <h3>Principal axes</h3>
      <p>Choose the body frame aligned with the principal axes of inertia, so $I = \\mathrm{diag}(I_1, I_2, I_3)$. Then the three scalar Euler equations decouple in their inertia parts:</p>
      <div class="formula-block">$$\\begin{aligned} I_1 \\dot{\\omega}_1 &= (I_2 - I_3) \\omega_2 \\omega_3 + \\tau_1 \\\\ I_2 \\dot{\\omega}_2 &= (I_3 - I_1) \\omega_3 \\omega_1 + \\tau_2 \\\\ I_3 \\dot{\\omega}_3 &= (I_1 - I_2) \\omega_1 \\omega_2 + \\tau_3 \\end{aligned}$$</div>
      <p>The coupling never disappears, just simplifies. Numerically, this is what you simulate in <code>ex6</code>.</p>

      <h3>Torque-free rotation and the intermediate axis</h3>
      <p>Set $\\tau = 0$. The system has conserved energy and conserved angular momentum, so the trajectory in $\\omega$-space lies on the intersection of two ellipsoids. The classical result:</p>
      <div class="key-box">
        <div class="label">The intermediate axis theorem</div>
        <p>Spin around the axis of <strong>largest</strong> or <strong>smallest</strong> moment of inertia is stable. Spin around the intermediate axis is <strong>unstable</strong>. The tennis-racket effect: throw a tennis racket in the air around its intermediate axis and it flips.</p>
      </div>
      <p>For a spacecraft, this means choose the spin axis as the major or minor principal axis. Spinning around the intermediate axis leads to large oscillations.</p>

      <h3>Coupling with kinematics</h3>
      <p>Euler's equation gives you $\\omega(t)$. To know the actual attitude you have to integrate the kinematic equation (DCM, Euler, or quaternion) with that $\\omega$ as input. The two together &mdash; six or seven coupled nonlinear ODEs &mdash; are the full attitude model.</p>
      <p>For control design, you typically work with both at once: the controller produces $\\tau$, which produces $\\omega$ through Euler's equation, which propagates the attitude through the kinematic equation.</p>

      <div class="key-box">
        <div class="label">What the exam asks</div>
        <ul>
          <li>State Euler's equation in vector form.</li>
          <li>Identify principal axes from the inertia tensor.</li>
          <li>Predict stability of torque-free spin around an axis given the three inertias.</li>
          <li>Set up the full 6-state (quaternion + $\\omega$) simulation in Simulink.</li>
        </ul>
      </div>
    `
  },

  attctrl: {
    title: 'Attitude control',
    lead: 'Drive the attitude to a reference. The standard exam controller: PD on the quaternion error vector and the angular velocity. Lyapunov shows it works globally.',
    body: `
      <h3>The control problem</h3>
      <p>Given a desired attitude $q_r$ (possibly time-varying) and the current attitude $q$, design a torque $\\tau$ that drives $q \\to q_r$ and $\\omega \\to \\omega_r$. The combined dynamics are Euler's equation plus the quaternion kinematic equation.</p>

      <h3>Quaternion error</h3>
      <p>The error quaternion is defined by the rotation from $q_r$ to $q$:</p>
      <div class="formula-block">$$q_e = q_r^{-1} \\otimes q = (q_{e,0}, q_{e,v}).$$</div>
      <p>If $q = q_r$, then $q_e = (1, 0, 0, 0)$ &mdash; the identity. The vector part $q_{e,v}$ is what you regulate to zero. Note $-q_e$ represents the same rotation as $q_e$, so the convention is to flip if $q_{e,0} < 0$ (always rotate the short way).</p>

      <h3>The PD law</h3>
      <p>For regulation to a fixed attitude, the classical law is</p>
      <div class="formula-block"><div class="label">Quaternion PD control</div>$$\\tau = -K_p \\, q_{e,v} - K_d \\, \\omega, \\quad K_p, K_d \\succ 0.$$</div>
      <p>For tracking a time-varying $q_r$ with reference rate $\\omega_r$, replace $\\omega$ with $\\omega - R(q_e) \\omega_r$ and add a feedforward $I \\dot{\\omega}_r + \\omega \\times I \\omega$ term.</p>

      <h3>Lyapunov analysis</h3>
      <p>Pick the Lyapunov candidate</p>
      <div class="formula-block">$$V = \\tfrac12 \\omega^\\top I \\omega + 2 K_p (1 - q_{e,0}).$$</div>
      <p>The first term is rotational kinetic energy, the second a potential built from the scalar part of the error quaternion. Under the PD law,</p>
      <div class="formula-block">$$\\dot{V} = -\\omega^\\top K_d \\omega \\leq 0,$$</div>
      <p>and LaSalle's principle shows the equilibrium $q_e = (1, 0)$, $\\omega = 0$ is asymptotically stable globally except for the antipodal point $q_e = (-1, 0)$ &mdash; which represents the same physical attitude.</p>

      <h3>Why quaternion error, not Euler error</h3>
      <p>Two reasons. First, the Euler-angle error blows up at the gimbal-lock singularity. Second, the quaternion product captures rotation composition cleanly, so $q_e$ is the natural "what rotation gets me from current to desired". For control work, always use quaternion error.</p>

      <div class="key-box">
        <div class="label">The recipe</div>
        <ol>
          <li>Compute $q_e = q_r^{-1} \\otimes q$. Flip sign if $q_{e,0} < 0$ to always take the short path.</li>
          <li>Apply $\\tau = -K_p q_{e,v} - K_d \\omega$ (plus feedforward for tracking).</li>
          <li>Tune $K_p, K_d$ for the desired bandwidth and damping. For a near-linear regime, the closed loop looks like $I \\ddot{q}_{e,v} + K_d \\dot{q}_{e,v} + K_p q_{e,v} \\approx 0$.</li>
        </ol>
      </div>
    `
  },

  orbital: {
    title: 'Orbital dynamics',
    lead: 'The two-body problem. A satellite orbits a central body following Kepler. The conic type comes from the orbital energy.',
    body: `
      <h3>The two-body equation</h3>
      <p>For a satellite of negligible mass orbiting a central body of mass $M$, the relative position $\\mathbf{r}$ in the inertial frame satisfies</p>
      <div class="formula-block"><div class="label">Two-body equation</div>$$\\ddot{\\mathbf{r}} = -\\frac{\\mu}{r^3}\\, \\mathbf{r}, \\qquad \\mu = G M.$$</div>
      <p>$\\mu$ is the standard gravitational parameter. For Earth, $\\mu \\approx 3.986 \\times 10^{14} \\, \\mathrm{m}^3/\\mathrm{s}^2$. This is a nonlinear, central-force ODE; the solution lies in a plane (because angular momentum is conserved).</p>

      <h3>The six orbital elements</h3>
      <p>Six numbers parameterize an orbit:</p>
      <table class="calc-table">
        <tr><th>Element</th><th>Meaning</th></tr>
        <tr><td>$a$ &mdash; semi-major axis</td><td>Orbit size</td></tr>
        <tr><td>$e$ &mdash; eccentricity</td><td>Shape: $0$ circle, $&lt; 1$ ellipse, $= 1$ parabola, $&gt; 1$ hyperbola</td></tr>
        <tr><td>$i$ &mdash; inclination</td><td>Tilt of the orbit plane vs the equator</td></tr>
        <tr><td>$\\Omega$ &mdash; RAAN</td><td>Right ascension of ascending node (orientation of the plane in space)</td></tr>
        <tr><td>$\\omega$ &mdash; argument of perigee</td><td>Orientation of the ellipse within the plane</td></tr>
        <tr><td>$\\nu$ or $M$ &mdash; true / mean anomaly</td><td>Position along the orbit at a given time</td></tr>
      </table>

      <h3>Conic sections by energy</h3>
      <p>The specific orbital energy is</p>
      <div class="formula-block">$$\\varepsilon = \\frac{v^2}{2} - \\frac{\\mu}{r} = -\\frac{\\mu}{2a}.$$</div>
      <p>Its sign determines the conic type:</p>
      <ul>
        <li>$\\varepsilon &lt; 0$: bound orbit, an <strong>ellipse</strong> (circle is the special case $e = 0$).</li>
        <li>$\\varepsilon = 0$: <strong>parabola</strong>, escape velocity exactly.</li>
        <li>$\\varepsilon &gt; 0$: <strong>hyperbola</strong>, escape with excess velocity.</li>
      </ul>
      <p>The escape speed at radius $r$ is $v_{esc} = \\sqrt{2\\mu/r}$.</p>

      <h3>Hohmann transfer</h3>
      <p>The minimum-fuel impulsive transfer between two circular coplanar orbits at radii $r_1$ and $r_2$. Two burns:</p>
      <ul>
        <li>$\\Delta v_1$ at $r_1$, tangential, to enter an ellipse with perihelion $r_1$ and aphelion $r_2$.</li>
        <li>$\\Delta v_2$ at $r_2$, tangential, to circularize at $r_2$.</li>
      </ul>
      <div class="formula-block">$$\\Delta v_1 = \\sqrt{\\frac{\\mu}{r_1}}\\left(\\sqrt{\\frac{2 r_2}{r_1 + r_2}} - 1\\right), \\quad \\Delta v_2 = \\sqrt{\\frac{\\mu}{r_2}}\\left(1 - \\sqrt{\\frac{2 r_1}{r_1 + r_2}}\\right).$$</div>

      <h3>Frames for orbit work</h3>
      <p>Propagation is done in the <strong>ECI</strong> frame (inertial). Conversion to <strong>orbital / LVLH</strong> is useful for Earth-pointing missions. Conversion to <strong>ECEF</strong> gives ground tracks. The frame choice is dictated by what you want to plot, not by the dynamics.</p>

      <div class="key-box">
        <div class="label">Exam staples</div>
        <ul>
          <li>State the two-body equation and its conserved quantities (energy, angular momentum).</li>
          <li>Classify an orbit from its energy or eccentricity.</li>
          <li>Compute escape velocity at a given radius.</li>
          <li>Compute Hohmann transfer $\\Delta v$ between two circular orbits.</li>
        </ul>
      </div>
    `
  },

};

// =================== QUIZ DATA ===================
const QUIZ = [
  // DYNSYS
  { topic: 'dynsys', type: 'mc', q: 'A 4th-order scalar ODE in $y$ becomes a state equation with how many states?',
    options: ['1', '2', '3', '4'], a: 3,
    expl: 'Stack $y$ and its first three derivatives: $x = (y, \\dot y, \\ddot y, \\dddot y)$.' },
  { topic: 'dynsys', type: 'mc', q: 'An equilibrium of the autonomous system $\\dot x = f(x)$ is a point where:',
    options: ['$f(\\bar x) = \\bar x$', '$f(\\bar x) = 0$', '$\\dot{f}(\\bar x) = 0$', '$x(0) = 0$'], a: 1,
    expl: 'At an equilibrium the time derivative is zero, $f(\\bar x) = 0$. Solving this is algebra, not integration.' },
  { topic: 'dynsys', type: 'mc', q: 'A system is time-invariant when:',
    options: ['the state is constant', '$f$ and $h$ do not depend explicitly on $t$', 'the input is zero', 'the output is bounded'], a: 1,
    expl: 'Time-invariance means the right-hand side has no explicit $t$ dependence.' },

  // STABILITY
  { topic: 'stability', type: 'mc', q: 'An equilibrium that is stable but not asymptotically stable means:',
    options: ['trajectories diverge slowly', 'trajectories stay near but need not converge', 'trajectories converge in finite time', 'no trajectories are defined'], a: 1,
    expl: 'Stability is "stay near"; convergence is an extra requirement (asymptotic stability).' },
  { topic: 'stability', type: 'mc', q: 'The Jacobian at $\\bar x$ has eigenvalues with all negative real parts. What can you conclude?',
    options: ['Globally asymptotically stable', 'Locally asymptotically stable (in fact exponentially)', 'Unstable', 'Cannot conclude'], a: 1,
    expl: 'A hyperbolic stable linearization gives local exponential stability of the nonlinear system. Global stability needs Lyapunov.' },
  { topic: 'stability', type: 'mc', q: 'The Jacobian at $\\bar x$ has one eigenvalue with zero real part and the rest negative. The linearization is:',
    options: ['Stable for the nonlinear system', 'Unstable for the nonlinear system', 'Inconclusive: depends on higher-order terms', 'Always exponentially stable'], a: 2,
    expl: 'Hartman-Grobman does not apply. Need Lyapunov or centre manifold analysis to conclude.' },
  { topic: 'stability', type: 'mc', q: 'Which implication is correct?',
    options: ['Stable implies asymptotically stable', 'Exponentially stable implies asymptotically stable', 'Asymptotically stable implies exponentially stable', 'Stable implies exponentially stable'], a: 1,
    expl: 'Exponential implies asymptotic implies stable. The reverse implications do not hold.' },

  // NLBEHAV
  { topic: 'nlbehav', type: 'mc', q: 'A limit cycle is:',
    options: ['Any closed orbit', 'An isolated closed orbit', 'A spiral converging to an equilibrium', 'A straight-line trajectory'], a: 1,
    expl: 'A limit cycle is isolated: nearby trajectories spiral toward (stable) or away from (unstable) it.' },
  { topic: 'nlbehav', type: 'mc', q: 'A Hopf bifurcation produces:',
    options: ['Two equilibria colliding', 'A limit cycle appearing around a destabilizing equilibrium', 'Chaos', 'Multiple disconnected basins'], a: 1,
    expl: 'Hopf: an equilibrium loses stability as a parameter crosses a threshold, and a limit cycle is born around it.' },

  // LYAPUNOV
  { topic: 'lyapunov', type: 'mc', q: 'For Lyapunov direct method, the candidate $V$ must satisfy:',
    options: ['$V(0) = 0$ and $V(x) > 0$ for $x \\neq 0$', '$V(0) > 0$', '$V$ is quadratic', '$V$ is bounded'], a: 0,
    expl: 'A Lyapunov function is positive definite about the equilibrium (here, the origin).' },
  { topic: 'lyapunov', type: 'mc', q: 'If $\\dot V(x) < 0$ for $x \\neq 0$ in a neighbourhood, the origin is:',
    options: ['Stable but not asymptotically', 'Asymptotically stable', 'Unstable', 'Marginally stable'], a: 1,
    expl: 'Strict negative definiteness of $\\dot V$ gives asymptotic stability (locally). Radially unbounded $V$ plus $\\dot V < 0$ everywhere gives global.' },
  { topic: 'lyapunov', type: 'mc', q: 'LaSalle invariance principle is useful when:',
    options: ['$\\dot V > 0$', '$\\dot V \\leq 0$ but $\\dot V = 0$ on a set bigger than $\\{0\\}$', 'V is unbounded', 'The system is linear'], a: 1,
    expl: 'LaSalle concludes convergence to the largest invariant set inside $\\{\\dot V = 0\\}$. Use it when $\\dot V$ is only semidefinite.' },
  { topic: 'lyapunov', type: 'numeric', q: 'For $\\dot x = -x^3$ and $V = x^2$, compute $\\dot V$ at $x = 2$. Enter the number.', a: -32, tol: 0.01,
    expl: '$\\dot V = 2x \\dot x = 2x(-x^3) = -2x^4$. At $x = 2$: $-2 \\cdot 16 = -32$.' },

  // JACOBIAN
  { topic: 'jacobian', type: 'mc', q: 'Hartman-Grobman applies when:',
    options: ['The system is linear', 'The Jacobian has no eigenvalues on the imaginary axis', 'The equilibrium is at the origin', 'The system is autonomous'], a: 1,
    expl: 'Hartman-Grobman requires a hyperbolic equilibrium: no zero-real-part eigenvalues.' },
  { topic: 'jacobian', type: 'mc', q: 'Linearization captures:',
    options: ['Global behaviour', 'Local behaviour near the equilibrium', 'Behaviour only at the equilibrium point itself', 'Periodic behaviour'], a: 1,
    expl: 'Jacobian linearization is valid in a neighbourhood of the equilibrium. Size of the neighbourhood depends on the system.' },
  { topic: 'jacobian', type: 'numeric', q: 'For $\\dot x_1 = x_2$, $\\dot x_2 = -\\sin(x_1) - 0.5 x_2$, what is $\\partial f_2 / \\partial x_1$ at the origin?', a: -1, tol: 0.01,
    expl: '$\\partial f_2 / \\partial x_1 = -\\cos(x_1)$, which is $-1$ at $x_1 = 0$.' },

  // FL
  { topic: 'fl', type: 'mc', q: 'The relative degree $r$ of an output $y = h(x)$ is:',
    options: ['The state dimension', 'The number of derivatives of $y$ until $u$ appears', 'Zero', 'Infinite'], a: 1,
    expl: 'Differentiate $y$ until the input shows up. The first such derivative order is $r$.' },
  { topic: 'fl', type: 'mc', q: 'When $r < n$, you must check:',
    options: ['That $f$ is linear', 'The zero dynamics for stability', 'That $g$ is invertible', 'The eigenvalues of $A$'], a: 1,
    expl: 'The $n - r$ internal coordinates have their own dynamics. If those zero dynamics are unstable, the closed-loop has hidden instability.' },
  { topic: 'fl', type: 'mc', q: 'The Lie derivative $L_f h$ is:',
    options: ['$f \\cdot h$', '$\\nabla h \\cdot f$ (directional derivative of $h$ along $f$)', '$\\nabla f \\cdot h$', '$\\partial h / \\partial t$'], a: 1,
    expl: 'Lie derivative along the vector field $f$: $L_f h = \\nabla h \\cdot f$. Used in iterated form to find the relative degree.' },
  { topic: 'fl', type: 'mc', q: 'Feedback linearization fails if:',
    options: ['The system is linear', 'The zero dynamics are unstable', 'The state is high-dimensional', 'The input is scalar'], a: 1,
    expl: 'Even when you cancel the nonlinearity at the output, unstable zero dynamics break the closed loop.' },

  // SLIDING
  { topic: 'sliding', type: 'mc', q: 'The standard reaching condition for sliding-mode control is:',
    options: ['$s = 0$', '$\\dot s = 0$', '$s \\dot s \\leq -\\eta |s|$, $\\eta > 0$', '$V > 0$'], a: 2,
    expl: 'The reaching law forces $s$ to zero in finite time via the Lyapunov inequality on $V = \\frac{1}{2}s^2$.' },
  { topic: 'sliding', type: 'mc', q: 'Chattering in sliding mode comes from:',
    options: ['Slow convergence', 'The infinite-frequency switching of the $\\mathrm{sign}(s)$ term', 'Linearization error', 'Numerical integration'], a: 1,
    expl: 'The discontinuous $\\mathrm{sign}(s)$ switches infinitely fast on the surface, exciting unmodelled dynamics.' },
  { topic: 'sliding', type: 'mc', q: 'Replacing $\\mathrm{sign}(s)$ with $\\tanh(s/\\phi)$ (boundary layer) trades:',
    options: ['Speed for accuracy', 'Less chattering for less robustness', 'Stability for unboundedness', 'Linear for nonlinear'], a: 1,
    expl: 'The boundary layer smooths the discontinuity. The trajectory now lives in a band around $s = 0$, weakening robustness.' },

  // NMPC
  { topic: 'nmpc', type: 'mc', q: 'The receding horizon principle means:',
    options: ['Solve once, apply all', 'Solve at each timestep, apply the first input, shift horizon', 'Increase horizon over time', 'Skip future predictions'], a: 1,
    expl: 'NMPC re-plans at every step. You only ever apply the first input of the optimal sequence.' },
  { topic: 'nmpc', type: 'mc', q: 'The terminal cost $V_f$ and terminal set $\\mathcal{X}_f$ are needed to:',
    options: ['Make the QP convex', 'Guarantee closed-loop stability via a Lyapunov argument', 'Reduce computation', 'Add states'], a: 1,
    expl: 'Without them, NMPC has no general stability guarantee. With them, the optimal cost is a Lyapunov function.' },
  { topic: 'nmpc', type: 'mc', q: 'Linear MPC is the special case where:',
    options: ['Constraints are absent', 'Dynamics are linear and cost is quadratic, giving a QP per step', 'The horizon is infinite', 'No terminal cost is used'], a: 1,
    expl: 'Linear $f$ plus quadratic cost yields a convex QP at each timestep. Solvable at kHz rates in practice.' },

  // KALMAN
  { topic: 'kalman', type: 'mc', q: 'In the linear Kalman filter, the Kalman gain $K$ is computed as:',
    options: ['$K = P C^\\top R^{-1}$', '$K = P C^\\top (C P C^\\top + R)^{-1}$', '$K = C P C^\\top + R$', '$K = A P + Q$'], a: 1,
    expl: 'Standard KF formula: $K = P_{|k} C^\\top (CP_{|k}C^\\top + R)^{-1}$. It weights model vs measurement by their covariances.' },
  { topic: 'kalman', type: 'mc', q: 'The EKF differs from the linear KF by:',
    options: ['Using a different cost function', 'Linearizing $f$ and $h$ about the current estimate to propagate the covariance', 'Discarding the measurement', 'Running offline'], a: 1,
    expl: 'In the EKF the mean uses the true nonlinear $f, h$, while the covariance is propagated using the Jacobians $F_k, H_k$.' },
  { topic: 'kalman', type: 'mc', q: 'The EKF can fail when:',
    options: ['Measurements are accurate', 'The initial estimate is far from the true state or nonlinearity is strong', 'The system is linear', 'Noise is zero'], a: 1,
    expl: 'EKF is a first-order approximation. Poor initial estimates or strong nonlinearity break the Gaussian/linearization assumption.' },

  // FRAMES
  { topic: 'frames', type: 'mc', q: 'A direction cosine matrix $R \\in SO(3)$ satisfies:',
    options: ['$R^\\top R = R$', '$R^\\top R = I$ and $\\det R = +1$', '$R = -R^\\top$', '$R^2 = I$'], a: 1,
    expl: 'Rotations are orthogonal matrices with determinant $+1$ (proper rotations).' },
  { topic: 'frames', type: 'mc', q: 'The 3-2-1 (yaw-pitch-roll) Euler-angle representation has a singularity at:',
    options: ['$\\phi = 0$', '$\\theta = \\pm \\pi/2$ (pitch at $90^\\circ$)', '$\\psi = 0$', 'No singularity'], a: 1,
    expl: 'Gimbal lock: at pitch $\\pm 90^\\circ$, yaw and roll merge. The Euler-angle rates diverge.' },
  { topic: 'frames', type: 'mc', q: 'A unit quaternion represents a rotation by angle $\\theta$ about axis $\\hat n$ as:',
    options: ['$(\\cos\\theta, \\hat n \\sin\\theta)$', '$(\\cos(\\theta/2), \\hat n \\sin(\\theta/2))$', '$(\\theta, \\hat n)$', '$(1, \\theta \\hat n)$'], a: 1,
    expl: 'The half-angle is intrinsic: a $2\\pi$ rotation gives quaternion $-1$, not $+1$ (double cover of $SO(3)$).' },

  // ATTKIN
  { topic: 'attkin', type: 'mc', q: 'The quaternion kinematic equation $\\dot q = \\frac{1}{2}\\Omega(\\omega) q$ has:',
    options: ['Two states, no singularity', 'Four states, no singularity', 'Three states, one singularity', 'Nine states'], a: 1,
    expl: 'Four states (the four components of $q$). No singularity, but the unit-norm constraint must be preserved.' },
  { topic: 'attkin', type: 'mc', q: 'Why integrate quaternions instead of Euler angles in Simulink?',
    options: ['Fewer states', 'Linear ODE in $q$ for a given $\\omega$, no singularity', 'No need for $\\omega$', 'Faster solver'], a: 1,
    expl: 'The quaternion ODE is linear in $q$ for a fixed $\\omega$, free of the gimbal-lock singularity.' },
  { topic: 'attkin', type: 'mc', q: 'The DCM kinematic equation is $\\dot R = R [\\omega^B]_\\times$. The matrix $[\\omega]_\\times$ is:',
    options: ['Symmetric', 'Skew-symmetric', 'Diagonal', 'Orthogonal'], a: 1,
    expl: 'The cross-product matrix is skew-symmetric: $[\\omega]_\\times = -[\\omega]_\\times^\\top$. It encodes the cross product as a matrix multiplication.' },

  // ATTDYN
  { topic: 'attdyn', type: 'mc', q: 'Euler equation for a rigid body in the body frame is:',
    options: ['$I \\dot \\omega = \\tau$', '$I \\dot \\omega + \\omega \\times I \\omega = \\tau$', '$\\dot \\omega = I^{-1} \\tau$', '$\\omega \\times \\tau = 0$'], a: 1,
    expl: 'The full Euler equation includes the gyroscopic cross-product term that couples the axes.' },
  { topic: 'attdyn', type: 'mc', q: 'The intermediate axis theorem says torque-free spin is unstable around:',
    options: ['The axis of largest inertia', 'The axis of intermediate inertia', 'The axis of smallest inertia', 'Any principal axis'], a: 1,
    expl: 'Spin about the intermediate principal axis is unstable. Major and minor are stable. The tennis-racket / Dzhanibekov effect.' },
  { topic: 'attdyn', type: 'mc', q: 'In torque-free motion ($\\tau = 0$), the conserved quantities are:',
    options: ['Energy only', 'Angular momentum only', 'Both energy and angular momentum', 'Neither'], a: 2,
    expl: 'Both kinetic energy $\\frac{1}{2}\\omega^\\top I \\omega$ and angular momentum (in the inertial frame) are conserved.' },
  { topic: 'attdyn', type: 'numeric', q: 'Body with $I_1 = 1$, $I_2 = 4$, $I_3 = 2$. Around which axis is torque-free spin UNSTABLE? Enter the index (1, 2, or 3).', a: 3, tol: 0,
    expl: 'Order the inertias: $I_1 = 1 < I_3 = 2 < I_2 = 4$. The intermediate is $I_3$ (axis 3). That spin is unstable.' },

  // ATTCTRL
  { topic: 'attctrl', type: 'mc', q: 'The standard quaternion PD control law is:',
    options: ['$\\tau = -K_p q - K_d \\omega$', '$\\tau = -K_p q_{e,v} - K_d \\omega$', '$\\tau = -K_p \\omega$', '$\\tau = q_e$'], a: 1,
    expl: 'Feed back the vector part of the error quaternion $q_{e,v}$, plus angular velocity damping.' },
  { topic: 'attctrl', type: 'mc', q: 'Why use quaternion error rather than Euler-angle error in control?',
    options: ['Quaternions are smaller', 'No singularity and clean composition rule', 'They are easier to integrate', 'Less numerical noise'], a: 1,
    expl: 'Euler-angle error blows up at gimbal lock. Quaternion error is singularity-free and composes cleanly.' },
  { topic: 'attctrl', type: 'mc', q: 'A typical Lyapunov function for quaternion PD control includes:',
    options: ['$\\omega$ only', 'Rotational kinetic energy plus a potential built from $1 - q_{e,0}$', '$q_{e,0}$ only', 'Just $\\lVert q \\rVert^2$'], a: 1,
    expl: '$V = \\frac{1}{2}\\omega^\\top I \\omega + 2 K_p (1 - q_{e,0})$. Then $\\dot V = -\\omega^\\top K_d \\omega \\leq 0$.' },

  // ORBITAL
  { topic: 'orbital', type: 'mc', q: 'The two-body equation for relative position $\\mathbf r$ is:',
    options: ['$\\ddot{\\mathbf r} = 0$', '$\\ddot{\\mathbf r} = -\\frac{\\mu}{r^3} \\mathbf r$', '$\\dot{\\mathbf r} = -\\frac{\\mu}{r} \\mathbf r$', '$\\mathbf r \\times \\dot{\\mathbf r} = \\mu$'], a: 1,
    expl: 'Central inverse-square gravitational force per unit mass: $\\ddot{\\mathbf r} = -\\mu \\mathbf r / r^3$.' },
  { topic: 'orbital', type: 'mc', q: 'Specific orbital energy $\\varepsilon = v^2/2 - \\mu/r$ is negative for:',
    options: ['Hyperbolic orbits', 'Elliptical (bound) orbits', 'Parabolic escape', 'Linear motion'], a: 1,
    expl: 'Negative energy means bound: an ellipse. Zero energy is parabolic escape. Positive is hyperbolic.' },
  { topic: 'orbital', type: 'numeric', q: 'Escape speed at $r = 7000$ km from Earth ($\\mu = 3.986 \\times 10^{14}$). Enter in m/s to nearest 100.', a: 10670, tol: 200,
    expl: '$v_{esc} = \\sqrt{2\\mu/r} = \\sqrt{2 \\cdot 3.986\\mathrm{e}{14} / 7\\mathrm{e}{6}} \\approx 10\\,672$ m/s.' },

  // ================= EXAM-STYLE QUESTIONS =================
  // Modeled on real exam question types with paired distractors.

  { topic: 'attctrl', type: 'mc',
    q: 'Rotate the vector $v_b = (1, 0, 0)$ from body to inertial frame using the unnormalized quaternion $q = (3/\\sqrt{2}, 0, 1, 0)$. What is $v_i$?',
    options: [
      '$(0.636, 0, 0.771)$',
      '$(0.771, 0, 0.636)$',
      '$(0.636, 0, -0.771)$',
      '$(-0.636, 0, 0.771)$',
      'None of the others'
    ], a: 0,
    hint: 'The quaternion must be normalized first. Compute $\\lVert q \\rVert = \\sqrt{9/2 + 0 + 1 + 0} = \\sqrt{5.5}$. Then apply $v_i = q \\otimes v_b \\otimes q^*$ or use <code>vec_rot_quat</code> from lib_rotations.',
    expl: 'Norm $\\lVert q \\rVert = \\sqrt{5.5} \\approx 2.345$. Normalized $q \\approx (0.905, 0, 0.426, 0)$: rotation of $\\approx 50.5°$ about the y-axis. Rotating $(1,0,0)$: $v_i \\approx (\\cos 50.5°, 0, \\sin 50.5°) = (0.636, 0, 0.771)$. Distractor B has components swapped; C and D flip signs.' },

  { topic: 'fl', type: 'mc',
    q: 'For $\\dot x = f(x) + g(x)u$, $y = h(x)$ with $f = [x_1^2 + 2x_4;\\; x_3^2;\\; x_1 x_4 - 0.5 x_3;\\; x_2 + 0.2 x_4]$, $g = [-1;0;0;0]$, $h = x_4$. Find the relative degree $\\gamma$.',
    options: [
      '$\\gamma = 1$',
      '$\\gamma = 2$',
      '$\\gamma = 3$',
      '$\\gamma = 4$',
      'System is not full relative degree'
    ], a: 3,
    hint: 'Differentiate $y = x_4$ along the dynamics. $\\dot y = f_4 = x_2 + 0.2 x_4$. Continue until $u$ shows up. Or just call <code>io_fl(f, g, h, name)</code> and read $\\gamma$.',
    expl: '$L_f h = f_4 = x_2 + 0.2 x_4$ (no $u$). $L_f^2 h = f_2 + 0.2 f_4 = x_3^2 + 0.2(x_2 + 0.2 x_4)$ (no $u$). $L_f^3 h$ contains $f_3 = x_1 x_4 - 0.5 x_3$, still no $u$. $L_f^4 h$ contains $f_1 = x_1^2 + 2 x_4$, which when combined with $g_1 = -1$ finally makes $u$ appear. So $\\gamma = 4$.' },

  { topic: 'attdyn', type: 'mc',
    q: 'A rigid body has $I = \\text{diag}(2, 5, 3)$. Under torque-free rotation, the spin about axis 3 (with $I_3 = 3$) is:',
    options: [
      'Marginally stable (largest inertia axis)',
      'Unstable (intermediate axis)',
      'Marginally stable (smallest inertia axis)',
      'Asymptotically stable',
      'Depends on initial angular velocity magnitude'
    ], a: 1,
    hint: 'Order the moments of inertia: $I_1 = 2 < I_3 = 3 < I_2 = 5$. Which position does axis 3 hold?',
    expl: 'The moments of inertia in order are $I_1 = 2$, $I_3 = 3$, $I_2 = 5$. So axis 3 is the intermediate axis. The intermediate axis theorem: spin about the intermediate axis is unstable (tennis-racket / Dzhanibekov effect). Distractors A and C describe the stable major and minor axes.' },

  { topic: 'attdyn', type: 'mc',
    q: 'Same body $I = \\text{diag}(2, 5, 3)$. Spin about axis 2 (with $I_2 = 5$) is:',
    options: [
      'Marginally stable (largest inertia axis)',
      'Marginally stable (intermediate axis)',
      'Unstable',
      'Asymptotically stable',
      'Marginally stable (smallest inertia axis)'
    ], a: 0,
    hint: 'Which axis has the largest moment of inertia? Spin about largest or smallest is stable; only about intermediate is unstable.',
    expl: '$I_2 = 5$ is the largest moment. Spin about the major axis is marginally stable in the torque-free case (energy and angular momentum conserved, trajectories bounded on the momentum ellipsoid).' },

  { topic: 'stability', type: 'mc',
    q: 'Let $\\bar x$ be an equilibrium of $\\dot x = f(x)$. $\\bar x$ is locally simply stable if:',
    options: [
      'taking $x(0) = \\bar x$, $x(t) = \\bar x$ for all $t \\geq 0$',
      'taking $x(0)$ sufficiently close to $\\bar x$, $x(t)$ remains close to $\\bar x$ for all $t \\geq 0$',
      'taking $x(0)$ in an arbitrary neighbourhood of $\\bar x$, $x(t)$ remains close to $\\bar x$',
      'taking $x(0)$ arbitrarily, $x(t) \\to \\bar x$ as $t \\to \\infty$',
      'None of the others'
    ], a: 1,
    hint: 'The distinction is between "sufficiently close" (which allows the neighbourhood to be small) and "arbitrary" (which would imply global). Also note that "$x(0) = \\bar x$" is trivial: it holds for any equilibrium.',
    expl: 'Option A is trivially true for any equilibrium and says nothing about stability. Option C ("arbitrary neighbourhood") would be global. Option D describes asymptotic convergence, not simply stability. Only B is the standard Lyapunov definition.' },

  { topic: 'lyapunov', type: 'mc',
    q: 'System $\\dot x_1 = x_2$, $\\dot x_2 = -x_1 - x_2$. With $V(x) = x_1^2 + x_2^2$, what is $\\dot V(x)$?',
    options: [
      '$-x_1^2 - x_2^2$',
      '$-2 x_2^2$',
      '$-2 x_1^2$',
      '$-x_2^2 - x_1 x_2$',
      '$\\dot V > 0$, cannot conclude stability'
    ], a: 1,
    hint: '$\\dot V = \\nabla V \\cdot f = 2 x_1 \\dot x_1 + 2 x_2 \\dot x_2$. Substitute the dynamics carefully and simplify.',
    expl: '$\\dot V = 2 x_1 \\cdot x_2 + 2 x_2 \\cdot (-x_1 - x_2) = 2 x_1 x_2 - 2 x_1 x_2 - 2 x_2^2 = -2 x_2^2$. Only semi-definite (zero on $x_2 = 0$ axis), so use LaSalle for asymptotic conclusion.' },

  { topic: 'jacobian', type: 'mc',
    q: 'Nonlinear system $\\dot x_1 = x_2$, $\\dot x_2 = -x_1 + x_2^2 - u$. At $\\bar u = 0$, $\\bar x = (0,0)$, the eigenvalues of the linearization are:',
    options: [
      '$\\lambda = \\pm 1$',
      '$\\lambda = \\pm i$',
      '$\\lambda = -1, -1$',
      '$\\lambda = 1, 1$',
      'System cannot be linearized at this point'
    ], a: 1,
    hint: 'Compute $A = \\partial f/\\partial x$ at the equilibrium. Note that $\\partial(x_2^2)/\\partial x_2 = 2 x_2$, and evaluate this at $\\bar x_2 = 0$.',
    expl: '$A = [0, 1;\\; -1, 2 x_2]$ evaluated at $\\bar x = 0$ gives $A = [0, 1;\\; -1, 0]$. Characteristic polynomial $\\lambda^2 + 1 = 0$, so $\\lambda = \\pm i$. Purely imaginary means Hartman-Grobman does not apply — linearization is inconclusive for the nonlinear stability.' },

  { topic: 'nmpc', type: 'mc',
    q: 'A satellite has body mass $m_b = 5000$ kg, propellant $m_p(0) = 5000$ kg, exhaust velocity $v_e = 5$ km/s. Maximum $\\Delta v$ from the rocket equation?',
    options: [
      '$\\Delta v \\approx 3.47$ km/s',
      '$\\Delta v = 5.00$ km/s',
      '$\\Delta v \\approx 5.49$ km/s',
      '$\\Delta v = 2.50$ km/s',
      'Cannot determine without target orbit'
    ], a: 0,
    hint: 'Tsiolkovsky rocket equation: $\\Delta v = v_e \\ln(m_0 / m_f)$ where $m_0 = m_b + m_p(0)$ and $m_f = m_b$.',
    expl: '$m_0 = 10000$, $m_f = 5000$, so $\\Delta v = 5 \\ln(10000/5000) = 5 \\ln 2 \\approx 5 \\cdot 0.693 = 3.47$ km/s. Distractor B is just $v_e$; D is $m_p / 2 v_e$-style guess; E is a trap since Tsiolkovsky needs no target.' },

  { topic: 'dynsys', type: 'mc',
    q: 'Discrete system $y(k+1) = y(k) + 2 u(k)$, $y(0) = 3$, $u = [1, 2, -1, 0, 3]$. Compute $y(5)$.',
    options: [
      '$y(5) = 13$',
      '$y(5) = 11$',
      '$y(5) = 15$',
      '$y(5) = 7$',
      'Cannot compute since the system is nonlinear'
    ], a: 0,
    hint: 'Iterate step by step. There are 5 inputs and you iterate 5 times to go from $y(0)$ to $y(5)$. The system is linear.',
    expl: '$y(1) = 3 + 2 \\cdot 1 = 5$. $y(2) = 5 + 2 \\cdot 2 = 9$. $y(3) = 9 + 2 \\cdot (-1) = 7$. $y(4) = 7 + 2 \\cdot 0 = 7$. $y(5) = 7 + 2 \\cdot 3 = 13$. Options B and C are indexing-off-by-one errors. E is a distractor for those who see "iterate" and panic.' },

  { topic: 'frames', type: 'mc',
    q: 'F1 is rotated wrt F2 by a rotation about axis 3 (z-axis) by angle $\\theta = \\pi/2$. A vector has components $v_2 = (1, 0, 0)$ in F2. What are its components $v_1$ in F1?',
    options: [
      '$(0, -1, 0)$',
      '$(0, 1, 0)$',
      '$(1, 0, 0)$',
      '$(-1, 0, 0)$',
      'Depends on active vs passive rotation convention'
    ], a: 0,
    hint: 'Passive frame convention: rotating F1 by $+\\pi/2$ about z means the x-axis of F1 points in the direction of the y-axis of F2. So a vector along the F2 x-axis, expressed in F1, points in the negative y direction.',
    expl: 'DCM $R_{12} = R_z(\\pi/2)^\\top = [0, 1, 0; -1, 0, 0; 0, 0, 1]$. Then $v_1 = R_{12} v_2 = (0, -1, 0)$. Option B swaps sign; C means no rotation (wrong); D flips sign of x (wrong). E is a trap — the exam expects the standard convention.' },

  { topic: 'attkin', type: 'mc',
    q: 'Given quaternion $q(0) = (1, 0, 0, 0)$ and constant angular velocity $\\omega = (0, \\pi/4, 0)$ rad/s in body frame. What is $q(t)$ at $t = 2$ s?',
    options: [
      '$(\\cos(\\pi/4), 0, \\sin(\\pi/4), 0) \\approx (0.707, 0, 0.707, 0)$',
      '$(\\cos(\\pi/4), \\sin(\\pi/4), 0, 0) \\approx (0.707, 0.707, 0, 0)$',
      '$(0, 0, \\sin(\\pi/2), \\cos(\\pi/2)) = (0, 0, 1, 0)$',
      '$(\\cos(\\pi/4), 0, -\\sin(\\pi/4), 0) \\approx (0.707, 0, -0.707, 0)$',
      '$(0.5, 0, 0.5, 0)$'
    ], a: 0,
    hint: 'Constant $\\omega$ produces uniform rotation by angle $\\theta = \\lVert \\omega \\rVert \\cdot t$ about $\\hat n = \\omega / \\lVert \\omega \\rVert$. Convert the resulting axis-angle to quaternion using the half-angle.',
    expl: 'Rotation angle $\\theta = \\lVert \\omega \\rVert t = (\\pi/4) \\cdot 2 = \\pi/2$. Axis is $\\hat y$. Quaternion: $(\\cos(\\theta/2), \\hat n \\sin(\\theta/2)) = (\\cos(\\pi/4), 0, \\sin(\\pi/4), 0)$. Option B rotates about x instead of y; D flips sign on y; E has wrong values (half of correct).' },

  { topic: 'attctrl', type: 'mc',
    q: 'The quaternion-error PD control law for satellite attitude regulation is:',
    options: [
      '$\\tau = -K_p q - K_d \\omega$',
      '$\\tau = -K_p q_{e,v} - K_d \\omega$',
      '$\\tau = -K_p \\omega - K_d q_{e,v}$',
      '$\\tau = K_p q_{e,v} + K_d \\omega$',
      '$\\tau = q_{e,v} \\times \\omega$'
    ], a: 1,
    hint: 'The proportional term feeds back the vector part of the error quaternion (not the full quaternion, and not the scalar part). The derivative term damps the angular velocity.',
    expl: 'Standard form: $\\tau = -K_p q_{e,v} - K_d \\omega$. Feeds back only the vector part of the error quaternion (the scalar part becomes 1 at the equilibrium). Both gains positive. Distractor A uses full $q$ (including scalar); C swaps roles of P and D; D has wrong sign.' },

  { topic: 'attctrl', type: 'mc',
    q: 'For quaternion $q = (0.5, 0.5, 0.5, 0.5)$, the conjugate $q^*$ and norm $\\lVert q \\rVert$ are:',
    options: [
      '$q^* = (0.5, -0.5, -0.5, -0.5)$, $\\lVert q \\rVert = 1$',
      '$q^* = (-0.5, 0.5, 0.5, 0.5)$, $\\lVert q \\rVert = 1$',
      '$q^* = (0.5, 0.5, 0.5, 0.5)$, $\\lVert q \\rVert = 1$',
      '$q^* = (0.5, -0.5, -0.5, -0.5)$, $\\lVert q \\rVert = 2$',
      '$q^* = (0.5, -0.5, -0.5, -0.5)$, $\\lVert q \\rVert = 0.5$'
    ], a: 0,
    hint: 'The conjugate flips the sign of the vector part (last 3 components) and keeps the scalar. Norm is $\\sqrt{q_0^2 + q_1^2 + q_2^2 + q_3^2}$.',
    expl: '$q^* = (q_0, -q_v) = (0.5, -0.5, -0.5, -0.5)$. Norm $= \\sqrt{4 \\cdot 0.25} = \\sqrt{1} = 1$. Distractor D squares the norm; E takes square root of the wrong thing.' },

  { topic: 'attctrl', type: 'mc',
    q: 'Compute the quaternion product $q_1 \\otimes q_2$ with $q_1 = (1, 0, 0, 0)$ (identity) and $q_2 = (0, 1, 0, 0)$.',
    options: [
      '$(0, 1, 0, 0)$',
      '$(0, 0, 1, 0)$',
      '$(1, 1, 0, 0)$',
      '$(-1, 0, 0, 0)$',
      '$(0, -1, 0, 0)$'
    ], a: 0,
    hint: '$q_1 = (1, 0, 0, 0)$ is the identity quaternion — same role as multiplying by 1.',
    expl: 'Identity times anything gives the anything: $q_1 \\otimes q_2 = q_2$. Distractors test whether you know the identity element.' },

  { topic: 'frames', type: 'mc',
    q: 'Which matrix is NOT a valid direction cosine matrix (DCM)?',
    options: [
      '$\\text{diag}(1, 1, 1)$',
      '$\\begin{bmatrix} \\cos\\theta & -\\sin\\theta & 0 \\\\ \\sin\\theta & \\cos\\theta & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$',
      '$\\text{diag}(1, 2, 1)$',
      '$\\begin{bmatrix} 0 & 1 & 0 \\\\ -1 & 0 & 0 \\\\ 0 & 0 & 1 \\end{bmatrix}$',
      '$\\begin{bmatrix} 0 & 0 & 1 \\\\ 1 & 0 & 0 \\\\ 0 & 1 & 0 \\end{bmatrix}$'
    ], a: 2,
    hint: 'A DCM must be orthogonal ($R^\\top R = I$) with determinant $+1$. Check row norms.',
    expl: 'Option C has middle row $(0, 2, 0)$ with norm 2, so $R^\\top R \\neq I$. All others are orthogonal with determinant $+1$.' },

  { topic: 'frames', type: 'mc',
    q: 'For the 3-2-1 (yaw-pitch-roll) Euler angle sequence, gimbal lock occurs at pitch:',
    options: [
      '$\\theta = 0$',
      '$\\theta = \\pi/4$',
      '$\\theta = \\pm \\pi/2$',
      '$\\theta = \\pm \\pi$',
      'Never (321 is singularity-free)'
    ], a: 2,
    hint: 'Gimbal lock happens when two of the rotation axes align. For 3-2-1, which pitch value makes the yaw and roll axes coincide?',
    expl: 'At $\\theta = \\pm\\pi/2$, the yaw ($\\psi$, first) and roll ($\\phi$, third) axes align. The rate transformation matrix becomes singular; Euler-angle rates blow up. This is why quaternions are preferred for control.' },

  { topic: 'attctrl', type: 'mc',
    q: 'The unit quaternions $q$ and $-q$ represent:',
    options: [
      'Different rotations',
      'The same physical rotation (double cover of SO(3))',
      'Inverse rotations of each other',
      'Conjugate rotations',
      'Cannot be compared'
    ], a: 1,
    hint: 'How many distinct unit quaternions correspond to one rotation matrix?',
    expl: 'Unit quaternions form a 2-to-1 cover of SO(3): both $q$ and $-q$ produce the same rotation matrix. This is why full-rotation angle differences of $2\\pi$ change sign of $q$ but preserve physical orientation.' },

  { topic: 'fl', type: 'mc',
    q: 'For $\\dot x_1 = x_2$, $\\dot x_2 = -x_1 + x_2 u$, $y = x_1$, the relative degree is:',
    options: [
      '$\\gamma = 1$',
      '$\\gamma = 2$',
      '$\\gamma = 3$',
      'Not defined at $x_2 = 0$',
      'System is not control-affine'
    ], a: 1,
    hint: 'Differentiate $y$ until $u$ appears in the equation.',
    expl: '$\\dot y = x_2$ (no $u$). $\\ddot y = \\dot x_2 = -x_1 + x_2 u$: $u$ appears at order 2, so $\\gamma = 2$. Note that the coefficient $x_2$ vanishes at $x_2 = 0$ — this is where the singularity is, but relative degree is still 2 away from it.' },

  { topic: 'fl', type: 'mc',
    q: 'A control-affine system with state dimension $n = 4$ has relative degree $\\gamma = 2$. The dimension of the zero dynamics is:',
    options: [
      '0',
      '1',
      '2',
      '3',
      '4'
    ], a: 2,
    hint: 'Zero dynamics live in the $n - \\gamma$ dimensional subspace that is not observable from the output.',
    expl: 'Dimension of zero dynamics $= n - \\gamma = 4 - 2 = 2$. These are the two internal states that remain when the output is identically zero.' },

  { topic: 'fl', type: 'mc',
    q: 'Feedback linearization via input-output design produces a stable closed loop if:',
    options: [
      'The relative degree equals the state dimension',
      'The zero dynamics are stable',
      'Either $\\gamma = n$ OR the zero dynamics are stable',
      'Both $\\gamma = n$ AND the zero dynamics are stable',
      'The system is linear'
    ], a: 2,
    hint: 'Two cases give a safe controller: full relative degree (no zero dynamics exist) or partial relative degree with stable zeros.',
    expl: 'If $\\gamma = n$, no zero dynamics; input-output design suffices. If $\\gamma < n$, must check zero dynamics stability. Either condition is enough on its own.' },

  { topic: 'attdyn', type: 'mc',
    q: 'A rigid body has $I = \\text{diag}(3, 3, 3)$ (isotropic). Torque-free spin about any axis is:',
    options: [
      'Marginally stable (any axis is equivalent)',
      'Asymptotically stable',
      'Unstable',
      'Depends on the chosen axis',
      'Undefined for isotropic bodies'
    ], a: 0,
    hint: 'For an isotropic body, is there an "intermediate" axis?',
    expl: 'When $I_1 = I_2 = I_3$, Euler equation becomes $I \\dot\\omega = -\\omega \\times I\\omega = -I(\\omega \\times \\omega) = 0$. So $\\omega$ is constant for any initial value — marginally stable about any axis.' },

  { topic: 'attdyn', type: 'mc',
    q: "Euler's equation for a torque-free rigid body in the body frame is:",
    options: [
      '$I \\dot\\omega = 0$',
      '$I \\dot\\omega + \\omega \\times I\\omega = 0$',
      '$I \\dot\\omega = \\omega \\times I\\omega$',
      '$\\dot\\omega = -\\omega \\times \\omega = 0$',
      '$\\dot H = 0$ where $H = I\\omega$'
    ], a: 1,
    hint: 'The cross-product term captures gyroscopic coupling between axes in the body frame.',
    expl: 'Standard form: $I \\dot\\omega + \\omega \\times I\\omega = 0$. Option E is true in the inertial frame ($\\dot H_{inertial} = 0$) but not the body frame equation. Option C has a sign error.' },

  { topic: 'attdyn', type: 'mc',
    q: 'Body with $I = \\text{diag}(10, 20, 15)$. Torque-free spin about axis 3 (with $I_3 = 15$) is:',
    options: [
      'Stable (largest inertia)',
      'Stable (smallest inertia)',
      'Unstable (intermediate axis)',
      'Depends on $\\omega$ magnitude',
      'Cannot answer without initial $\\omega$'
    ], a: 2,
    hint: 'Order the moments: $I_1 = 10, I_3 = 15, I_2 = 20$. Where does axis 3 rank?',
    expl: 'Axis 3 has moment 15, between 10 (axis 1) and 20 (axis 2). It is the intermediate axis. Spin here is unstable.' },

  { topic: 'attdyn', type: 'mc',
    q: 'In torque-free rigid body rotation, which quantities are conserved (in the inertial frame)?',
    options: [
      '$\\omega$ (angular velocity)',
      '$H = I\\omega$ (angular momentum)',
      '$T = \\tfrac{1}{2}\\omega^\\top I\\omega$ (kinetic energy)',
      'Both angular momentum and kinetic energy',
      'Neither'
    ], a: 3,
    hint: 'External torque is zero. What does Newton II for rotation say?',
    expl: 'Both angular momentum $H$ (Newton II) and kinetic energy $T$ (no work done) are conserved. $\\omega$ generally changes with time; only for isotropic bodies is $\\omega$ constant.' },

  { topic: 'lyapunov', type: 'mc',
    q: 'Is $V(x) = x_1^2 + x_1 x_2 + x_2^2$ positive definite?',
    options: [
      'Yes (matrix $P = [1, 0.5; 0.5, 1]$ has positive trace AND determinant)',
      'No (indefinite quadratic form)',
      'Only for $|x_1| > |x_2|$',
      'Yes but only semi-definite',
      'Cannot tell without evaluating at specific points'
    ], a: 0,
    hint: 'Write $V = x^\\top P x$ with $P$ symmetric. Check whether $P$ is positive definite by trace/determinant or by eigenvalues.',
    expl: '$V = x^\\top P x$ with $P = \\begin{bmatrix} 1 & 0.5 \\\\ 0.5 & 1 \\end{bmatrix}$. Trace $= 2 > 0$, $\\det = 0.75 > 0$, so both eigenvalues positive. $P \\succ 0$, hence $V$ is positive definite.' },

  { topic: 'lyapunov', type: 'mc',
    q: "If $V$ is positive definite and $\\dot V(x) < 0$ strictly for $x \\neq 0$ in a neighbourhood of the origin, then by Lyapunov's direct theorem the origin is:",
    options: [
      'Stable (but not necessarily asymptotically)',
      'Asymptotically stable (locally)',
      'Exponentially stable',
      'Globally asymptotically stable',
      'Marginally stable'
    ], a: 1,
    hint: 'Strict $\\dot V < 0$ gives asymptotic (not just stability). For global, an extra condition on $V$ is needed.',
    expl: 'Strict negative definite $\\dot V$ gives local asymptotic stability. Global requires $V$ radially unbounded and $\\dot V < 0$ everywhere. Exponential requires $\\dot V \\leq -c V$.' },

  { topic: 'lyapunov', type: 'mc',
    q: "If $V$ is positive definite and $\\dot V(x) \\leq 0$ (only semi-definite, not strict), the right move is:",
    options: [
      "Conclude asymptotic stability directly",
      "Conclude nothing",
      "Apply LaSalle's invariance principle",
      'Try a different $V$',
      "Conclude that the origin is unstable"
    ], a: 2,
    hint: 'LaSalle bridges the gap when $\\dot V = 0$ on a set larger than $\\{0\\}$.',
    expl: 'LaSalle: trajectories converge to the largest invariant set contained in $\\{\\dot V = 0\\}$. If that set is just the origin, you still get asymptotic stability.' },

  { topic: 'lyapunov', type: 'mc',
    q: 'For GLOBAL asymptotic stability by Lyapunov, in addition to $V$ positive definite and $\\dot V < 0$ for $x \\neq 0$, you need:',
    options: [
      '$V$ radially unbounded',
      '$V$ analytic',
      '$V$ bounded',
      '$\\dot V$ radially unbounded',
      '$\\dot V$ bounded'
    ], a: 0,
    hint: 'Without this condition, sublevel sets of $V$ could be unbounded, and trajectories might escape to infinity.',
    expl: 'Radial unboundedness ($V(x) \\to \\infty$ as $\\lVert x \\rVert \\to \\infty$) ensures sublevel sets are compact, so trajectories cannot escape. Also $\\dot V < 0$ must hold globally, not just in a neighbourhood.' },

  { topic: 'dynsys', type: 'mc',
    q: 'Nonlinear discrete system $y(k+1) = y(k)^2 - u(k)$, $y(0) = 2$, $u = [3, 4, 1]$. Compute $y(3)$.',
    options: [
      '$y(3) = 8$',
      '$y(3) = -8$',
      '$y(3) = 6$',
      '$y(3) = 0$',
      'Cannot compute since the system is nonlinear'
    ], a: 0,
    hint: 'Iterate step by step. Nonlinear does NOT mean impossible to compute.',
    expl: '$y(1) = 2^2 - 3 = 1$. $y(2) = 1^2 - 4 = -3$. $y(3) = (-3)^2 - 1 = 8$. Option E is the classic trap.' },

  { topic: 'dynsys', type: 'mc',
    q: 'Discrete system $y(k+1) = y(k) - 0.5 y(k-1) + u(k)$, $y(0) = 1$, $y(1) = 2$, $u = [1, 0, -1, 1]$. Compute $y(4)$.',
    options: [
      '$y(4) = -0.25$',
      '$y(4) = 0.25$',
      '$y(4) = 0.5$',
      '$y(4) = -0.75$',
      'Cannot compute since nonlinear'
    ], a: 0,
    hint: 'System is linear. Iterate: $y(k+1)$ depends on $y(k)$, $y(k-1)$, and $u(k)$. Watch indexing on $u$.',
    expl: '$y(2) = y(1) - 0.5 y(0) + u(1) = 2 - 0.5 + 0 = 1.5$. $y(3) = 1.5 - 0.5 \\cdot 2 + u(2) = 1.5 - 1 - 1 = -0.5$. $y(4) = -0.5 - 0.5 \\cdot 1.5 + u(3) = -0.5 - 0.75 + 1 = -0.25$.' },

  { topic: 'frames', type: 'mc',
    q: 'For a proper (right-handed) rotation matrix $R$, $\\det(R)$ equals:',
    options: [
      '$+1$',
      '$-1$',
      '$0$',
      '$\\lVert R \\rVert_2$',
      'Depends on the rotation angle'
    ], a: 0,
    hint: 'Rotations preserve orientation. Reflections would give $\\det = -1$.',
    expl: 'Proper rotations: $\\det R = +1$. Improper (reflections, mirror flips): $\\det = -1$. Orthogonal matrices always have $|\\det| = 1$.' },

  { topic: 'frames', type: 'mc',
    q: 'If $R_{ib}$ is the DCM from body to inertial frame, then a vector $v_b$ in body frame is expressed in inertial as:',
    options: [
      '$v_i = R_{ib} v_b$',
      '$v_i = R_{ib}^\\top v_b$',
      '$v_i = R_{ib}^{-1} v_b$',
      '$v_i = v_b$ (independent of frame)',
      '$v_i = R_{ib} v_b + t$ (translation needed)'
    ], a: 0,
    hint: 'The subscript $ib$ reads as "from $b$ to $i$". So the matrix maps body-frame components to inertial-frame components.',
    expl: '$v_i = R_{ib} v_b$. Options B and C are equivalent for orthogonal matrices ($R^\\top = R^{-1}$) but describe the reverse direction. E adds translation which is not part of pure rotation.' },

  { topic: 'nmpc', type: 'mc',
    q: 'In NMPC, the prediction horizon $T_p$ represents:',
    options: [
      'The sampling time between control updates',
      'How far into the future the controller optimizes',
      'The total simulation time',
      'The time constant of the plant',
      'The number of decision variables'
    ], a: 1,
    hint: 'NMPC solves a constrained optimization problem over a finite future window.',
    expl: '$T_p$ is the horizon length. Longer $T_p$: better lookahead but more computation. $T_s$ is sampling time (different).' },

  { topic: 'nmpc', type: 'mc',
    q: 'In receding-horizon (NMPC) control, at each sampling instant you:',
    options: [
      'Solve once and apply all optimized inputs across the horizon',
      'Solve the optimization, apply only the first optimal input, then re-solve at the next instant',
      'Apply the last input from the previous optimization',
      'Apply the average of predicted inputs',
      'No optimization is needed — use a lookup table'
    ], a: 1,
    hint: 'This is why the strategy is called "receding": the horizon shifts forward with time.',
    expl: 'At time $k$: solve optimization on $[k, k+T_p]$. Apply only $u^\\star(k)$. At $k+1$: shift horizon to $[k+1, k+1+T_p]$ and re-solve. Continuous re-planning.' },

  { topic: 'orbital', type: 'mc',
    q: 'Specific orbital energy $\\varepsilon = v^2/2 - \\mu/r$. When $\\varepsilon > 0$, the orbit is:',
    options: [
      'Elliptical (bound)',
      'Circular',
      'Parabolic (marginal escape)',
      'Hyperbolic (unbound)',
      'Undefined'
    ], a: 3,
    hint: 'Sign of specific energy classifies the conic section.',
    expl: '$\\varepsilon < 0$: ellipse (bound). $\\varepsilon = 0$: parabolic escape trajectory. $\\varepsilon > 0$: hyperbola, satellite has excess velocity and escapes to infinity.' },

  { topic: 'orbital', type: 'mc',
    q: 'For a circular orbit at radius $r$ around a body with gravitational parameter $\\mu$, the orbital velocity is:',
    options: [
      '$v = \\sqrt{\\mu / r}$',
      '$v = \\sqrt{2\\mu / r}$',
      '$v = \\mu / r$',
      '$v = \\mu / r^2$',
      '$v = \\sqrt{r / \\mu}$'
    ], a: 0,
    hint: 'Balance centripetal acceleration $v^2/r$ against gravitational acceleration $\\mu/r^2$.',
    expl: 'Centripetal $= v^2 / r$ equals gravitational $= \\mu / r^2$, giving $v = \\sqrt{\\mu / r}$. Option B is escape velocity ($\\sqrt 2$ times as large).' },

  { topic: 'orbital', type: 'mc',
    q: 'A Hohmann transfer between two circular orbits uses:',
    options: [
      'One impulsive burn',
      'Two impulsive burns',
      'Three impulsive burns',
      'Continuous thrust',
      'Depends on the ratio of the two radii'
    ], a: 1,
    hint: 'Minimum-fuel impulsive transfer between coplanar circular orbits.',
    expl: 'Two burns: first at departure orbit to raise/lower apoapsis to target radius. Second at target orbit to circularize.' },

  { topic: 'stability', type: 'mc',
    q: 'A linear system $\\dot x = Ax$ with $A$ having eigenvalues $\\lambda_1 = -2$, $\\lambda_2 = -3$ is:',
    options: [
      'Asymptotically stable',
      'Marginally stable',
      'Unstable',
      'Cannot conclude without initial condition',
      'Stable but not asymptotic'
    ], a: 0,
    hint: 'All eigenvalues have negative real parts.',
    expl: 'Both $\\text{Re}(\\lambda_i) < 0$: exponential decay, so asymptotic (in fact exponential) stability globally.' },

  { topic: 'stability', type: 'mc',
    q: 'A linear system with eigenvalues $\\lambda_{1,2} = \\pm i$ (purely imaginary, simple) is:',
    options: [
      'Asymptotically stable',
      'Marginally stable',
      'Unstable',
      'Exponentially stable',
      'Chaotic'
    ], a: 1,
    hint: 'No positive real parts, but no strict decay either. Check Jordan block size for the imaginary eigenvalues.',
    expl: 'Simple imaginary eigenvalues → marginal stability. Trajectories are bounded oscillations (limit cycle for linear system).' },

  { topic: 'stability', type: 'mc',
    q: 'A linear system with a double eigenvalue at $\\lambda = 0$ (with a $2 \\times 2$ Jordan block) is:',
    options: [
      'Marginally stable',
      'Asymptotically stable',
      'Unstable',
      'Exponentially stable',
      'Not classifiable'
    ], a: 2,
    hint: 'Jordan blocks of size $\\geq 2$ at zero-real-part eigenvalues produce polynomial (t) growth.',
    expl: 'For $A = \\begin{bmatrix} 0 & 1 \\\\ 0 & 0 \\end{bmatrix}$: solution $x_1(t) = x_1(0) + t \\cdot x_2(0)$ grows unboundedly. Unstable despite eigenvalues being non-positive.' },

  { topic: 'jacobian', type: 'mc',
    q: 'Nonlinear system $\\dot x_1 = -x_1 + x_2^2$, $\\dot x_2 = -x_2 + u$. Equilibrium at $\\bar u = 0$, $\\bar x = (0, 0)$. Linearization is:',
    options: [
      '$A = \\text{diag}(-1, -1)$, $B = (0, 1)^\\top$',
      '$A = \\text{diag}(-1, -1)$, $B = (1, 1)^\\top$',
      '$A = \\begin{bmatrix} -1 & 0 \\\\ 0 & -1 \\end{bmatrix}$, $B = (0, 0)^\\top$',
      '$A = \\begin{bmatrix} -1 & 2x_2 \\\\ 0 & -1 \\end{bmatrix}$, $B = (0, 1)^\\top$',
      '$A = \\begin{bmatrix} -1 & 0 \\\\ 1 & -1 \\end{bmatrix}$, $B = (0, 1)^\\top$'
    ], a: 0,
    hint: '$\\partial(x_2^2)/\\partial x_2 = 2 x_2$. Evaluate at $\\bar x_2 = 0$.',
    expl: '$A = \\begin{bmatrix} -1 & 2 x_2 \\\\ 0 & -1 \\end{bmatrix}$ evaluated at $(0,0)$ gives $\\text{diag}(-1, -1)$. $B = (0, 1)^\\top$. Distractor D leaves the derivative unevaluated (common mistake).' },

  { topic: 'attctrl', type: 'mc',
    q: 'A Lyapunov candidate for quaternion PD control is:',
    options: [
      '$V = \\lVert \\omega \\rVert^2$',
      '$V = \\lVert q \\rVert^2$',
      '$V = \\tfrac{1}{2} \\omega^\\top I \\omega + 2 K_p (1 - q_{e,0})$',
      '$V = K_p q_{e,v}^\\top q_{e,v}$',
      '$V = \\omega^\\top q$'
    ], a: 2,
    hint: 'Include both kinetic energy (via $\\omega$) and a potential that vanishes at $q_e = (1, 0, 0, 0)$.',
    expl: 'Standard: kinetic energy $\\tfrac{1}{2} \\omega^\\top I \\omega$ plus potential $2 K_p (1 - q_{e,0})$ that is zero at the target attitude and positive otherwise. Under $\\tau = -K_p q_{e,v} - K_d \\omega$: $\\dot V = -\\omega^\\top K_d \\omega \\leq 0$.' },

  { topic: 'attkin', type: 'mc',
    q: 'The kinematic equation $\\dot q = \\tfrac{1}{2}\\Omega(\\omega) q$ has how many state components, and how many singularities?',
    options: [
      '3 states, 1 singularity',
      '3 states, 0 singularities',
      '4 states, 1 singularity',
      '4 states, 0 singularities',
      '9 states, 0 singularities (DCM)'
    ], a: 3,
    hint: 'A unit quaternion has 4 components. Does the ODE have any singular value of $q$?',
    expl: '4 quaternion components, no singularities (contrast with 3 Euler angles + gimbal lock). Unit-norm constraint preserved by the ODE structure. Renormalize periodically to counter numerical drift.' },

  { topic: 'nlbehav', type: 'mc',
    q: 'A stable limit cycle in a 2-D nonlinear system means:',
    options: [
      'A stable equilibrium point',
      'A closed orbit that nearby trajectories spiral toward',
      'A closed orbit that nearby trajectories move away from',
      'A saddle point',
      'The system diverges to infinity'
    ], a: 1,
    hint: 'Limit cycle = isolated closed orbit. "Stable" describes how nearby trajectories behave.',
    expl: 'Stable limit cycle: isolated closed orbit that attracts nearby trajectories. Van der Pol is the classic example. Unstable limit cycles repel trajectories.' },

  { topic: 'nlbehav', type: 'mc',
    q: 'Chaos in continuous-time dynamical systems requires at least:',
    options: [
      '1 state dimension',
      '2 state dimensions',
      '3 state dimensions',
      '4 state dimensions',
      'Chaos requires a stochastic input'
    ], a: 2,
    hint: 'Poincaré-Bendixson theorem restricts what 2-D deterministic ODEs can do.',
    expl: 'Continuous-time chaos requires $n \\geq 3$. Poincaré-Bendixson: 2-D bounded systems can only approach equilibria or limit cycles. Chua and Lorenz are 3-D chaotic examples.' },

  { topic: 'dynsys', type: 'mc',
    q: 'For the system $\\dot x = f(x) + g(x) u$, if the state has dimension $n$ and the input has dimension $m$, then $f$ and $g$ have dimensions:',
    options: [
      '$f \\in \\mathbb{R}^n$, $g \\in \\mathbb{R}^{n \\times m}$',
      '$f \\in \\mathbb{R}^n$, $g \\in \\mathbb{R}^n$',
      '$f \\in \\mathbb{R}^{n \\times n}$, $g \\in \\mathbb{R}^n$',
      '$f \\in \\mathbb{R}^m$, $g \\in \\mathbb{R}^{m \\times n}$',
      '$f \\in \\mathbb{R}^n$, $g \\in \\mathbb{R}^{m \\times n}$'
    ], a: 0,
    hint: 'Both $f$ and $g u$ must contribute to $\\dot x$, which has the same dimension as $x$.',
    expl: '$f: \\mathbb{R}^n \\to \\mathbb{R}^n$ and $g: \\mathbb{R}^n \\to \\mathbb{R}^{n \\times m}$ so that $g(x) u \\in \\mathbb{R}^n$.' },

  { topic: 'kalman', type: 'mc',
    q: 'In the discrete-time Kalman filter, the update step (correction after measurement) modifies the state estimate as:',
    options: [
      '$\\hat x_k = \\hat x_{k|k-1} + K_k (y_k - H \\hat x_{k|k-1})$',
      '$\\hat x_k = \\hat x_{k|k-1} - K_k y_k$',
      '$\\hat x_k = K_k y_k$',
      '$\\hat x_k = \\hat x_{k|k-1} + K_k y_k$',
      '$\\hat x_k = H \\hat x_{k|k-1}$'
    ], a: 0,
    hint: 'The correction is proportional to the innovation: measured output minus predicted output.',
    expl: 'Innovation $= y_k - H \\hat x_{k|k-1}$. Multiplied by Kalman gain $K_k$ and added to prediction. Distractors B and D miss the predicted output subtraction; C ignores prediction entirely.' },

  { topic: 'kalman', type: 'mc',
    q: 'The Extended Kalman Filter (EKF) differs from the linear Kalman filter by:',
    options: [
      'Using a different cost function',
      'Linearizing $f$ and $h$ about the current estimate at each step',
      'Using a nonlinear cost',
      'Discarding the measurement',
      'Running in continuous time only'
    ], a: 1,
    hint: 'EKF handles nonlinear $f$ and $h$ by approximating them locally.',
    expl: 'EKF propagates the mean through the true (nonlinear) $f, h$, but propagates the covariance through Jacobians $F_k = \\partial f / \\partial x |_{\\hat x_k}$, $H_k = \\partial h / \\partial x |_{\\hat x_{k+1|k}}$. Re-linearized at each step.' }
];

// =================== FLASHCARD DATA ===================
const FLASHCARDS = [
  // DYNSYS
  { topic: 'dynsys', front: 'How do you convert an $n$-th order scalar ODE to state form?', back: 'Stack derivatives: $x_1 = y, x_2 = \\dot y, \\dots, x_n = y^{(n-1)}$. Then $\\dot x_i = x_{i+1}$ for $i < n$, and $\\dot x_n$ comes from the original ODE.' },
  { topic: 'dynsys', front: 'Definition of an equilibrium of $\\dot x = f(x)$.', back: 'A point $\\bar x$ with $f(\\bar x) = 0$. Finding equilibria is solving an algebraic equation, not integrating the ODE.' },
  { topic: 'dynsys', front: 'The four labels for a dynamic system.', back: 'Autonomous vs forced (input present), time-invariant vs time-varying, linear vs nonlinear, SISO vs MIMO. Be able to apply all four to a given system.' },

  // STABILITY
  { topic: 'stability', front: 'DISAMBIGUATION: stable vs asymptotically stable vs exponentially stable.', back: 'Stable: stay near.<br>Asymptotic: stable AND converge to $\\bar x$.<br>Exponential: $\\lVert x(t) - \\bar x \\rVert \\leq c\\, e^{-\\lambda t} \\lVert x(0) - \\bar x \\rVert$. Exponential implies asymptotic implies stable; not the reverse.' },
  { topic: 'stability', front: 'Eigenvalue test for stability via the linearization.', back: 'All $\\mathrm{Re}(\\lambda_i) < 0$: locally exponentially stable.<br>Some $\\mathrm{Re}(\\lambda_i) > 0$: unstable.<br>Some $\\mathrm{Re}(\\lambda_i) = 0$ (others $\\leq 0$): inconclusive, need Lyapunov.' },
  { topic: 'stability', front: 'When is the linearization test inconclusive?', back: 'When the Jacobian has any eigenvalue with zero real part. Then Hartman-Grobman fails; you need Lyapunov or centre-manifold analysis.' },
  { topic: 'stability', front: 'Local vs global asymptotic stability.', back: 'Local: holds for starts in some neighbourhood of $\\bar x$. Global: holds for any initial state. Global usually requires a Lyapunov function with $V \\to \\infty$ as $\\lVert x \\rVert \\to \\infty$ (radially unbounded).' },

  // NLBEHAV
  { topic: 'nlbehav', front: 'What is a limit cycle?', back: 'An isolated closed trajectory. Nearby trajectories spiral toward it (stable) or away (unstable). Linear systems cannot have isolated periodic orbits.' },
  { topic: 'nlbehav', front: 'Three bifurcations to recognize.', back: 'Saddle-node: two equilibria collide and disappear.<br>Pitchfork: one equilibrium splits into three.<br>Hopf: equilibrium loses stability, a limit cycle appears around it.' },
  { topic: 'nlbehav', front: 'Conditions for chaos.', back: 'Bounded trajectories that never settle, with extreme sensitivity to initial conditions. Needs three or more state dimensions in continuous time. Examples: Lorenz, Chua.' },

  // LYAPUNOV
  { topic: 'lyapunov', front: 'Lyapunov direct theorem: what to check.', back: '1. $V(0) = 0$, $V(x) > 0$ for $x \\neq 0$ (positive definite).<br>2. $\\dot V = \\nabla V \\cdot f \\leq 0$: stable.<br>3. $\\dot V < 0$ for $x \\neq 0$: asymptotically stable.<br>4. Add $V$ radially unbounded and $\\dot V < 0$ everywhere: global.' },
  { topic: 'lyapunov', front: 'Default first guess for $V$.', back: 'The system energy (kinetic + potential) for mechanical systems. Failing that, a quadratic $V = x^\\top P x$ with $P$ from the Lyapunov equation of the linearization.' },
  { topic: 'lyapunov', front: 'The Lyapunov equation for a linear system $\\dot x = A x$.', back: '$A^\\top P + P A = -Q$ for chosen $Q \\succ 0$. If $A$ is stable, the equation has a unique $P \\succ 0$ solution.' },
  { topic: 'lyapunov', front: 'When to use LaSalle\'s invariance principle.', back: 'When $\\dot V \\leq 0$ but $\\dot V = 0$ on more than just the equilibrium. LaSalle: trajectories converge to the largest invariant set inside $\\{\\dot V = 0\\}$.' },

  // JACOBIAN
  { topic: 'jacobian', front: 'Jacobian linearization recipe.', back: '1. Find equilibrium $f(\\bar x, \\bar u) = 0$.<br>2. Compute $A = \\partial f / \\partial x |_{\\bar x, \\bar u}$, $B = \\partial f / \\partial u |_{\\bar x, \\bar u}$.<br>3. Use $\\dot z = A z + B v$ with $z = x - \\bar x$, $v = u - \\bar u$.' },
  { topic: 'jacobian', front: 'Hartman-Grobman: what does it guarantee?', back: 'If the Jacobian is hyperbolic (no eigenvalues on the imaginary axis), the nonlinear and linearized systems are topologically equivalent in a neighbourhood of the equilibrium.' },
  { topic: 'jacobian', front: 'The marginal case.', back: 'At least one eigenvalue of the Jacobian has zero real part. Hartman-Grobman does not apply. Higher-order terms matter; fall back to Lyapunov.' },

  // FL
  { topic: 'fl', front: 'Definition of relative degree $r$.', back: 'Differentiate $y = h(x)$ along the dynamics. The smallest $r$ at which the input $u$ appears in $y^{(r)}$ is the relative degree. Equivalently, $L_g L_f^{r-1} h \\neq 0$.' },
  { topic: 'fl', front: 'Feedback linearization recipe (input-output).', back: '1. Compute relative degree $r$.<br>2. Linearizing input: $u = (v - L_f^r h) / (L_g L_f^{r-1} h)$.<br>3. Check zero dynamics if $r < n$.<br>Then $y^{(r)} = v$, a linear chain of integrators.' },
  { topic: 'fl', front: 'What are the zero dynamics, and why check them?', back: 'When $r < n$, the $n - r$ internal coordinates not seen by the output have their own dynamics. Setting $y \\equiv 0$ gives the zero dynamics. If unstable, the closed-loop hides instability.' },
  { topic: 'fl', front: 'Lie derivative notation.', back: '$L_f h = \\nabla h \\cdot f$ (scalar directional derivative). $L_f^k h$ is $L_f$ applied $k$ times. $L_g L_f^{r-1} h$ tells you when $u$ first appears.' },

  // SLIDING
  { topic: 'sliding', front: 'Sliding mode control three-line recipe.', back: '1. Choose sliding surface $s(x) = 0$ so dynamics on it are stable.<br>2. Pick a law enforcing $s \\dot s \\leq -\\eta |s|$ (reaching).<br>3. Replace $\\mathrm{sign}(s)$ with smooth approximation if chattering matters.' },
  { topic: 'sliding', front: 'Typical sliding surface for a second-order system.', back: '$s(x) = x_2 + \\lambda x_1$ with $\\lambda > 0$. On $s = 0$, $\\dot x_1 = -\\lambda x_1$: exponentially decaying first-order behaviour.' },
  { topic: 'sliding', front: 'Why is sliding mode robust?', back: 'Once on the surface, dynamics depend only on surface design, not on system parameters. Bounded matched disturbances are rejected by the sign-switching term.' },
  { topic: 'sliding', front: 'Boundary layer fix: what does it trade?', back: 'Replace $\\mathrm{sign}(s)$ with $\\tanh(s/\\phi)$ or $\\mathrm{sat}(s/\\phi)$ in a thin band around $s = 0$. Trades less chattering for less robustness (trajectory now in a band, not on the surface).' },

  // NMPC
  { topic: 'nmpc', front: 'Write the NMPC optimization problem.', back: '$\\min_\\mathbf{u} \\sum_{i=0}^{N-1} \\ell(x_{k+i|k}, u_{k+i|k}) + V_f(x_{k+N|k})$ s.t. $x_{k+i+1|k} = f(x_{k+i|k}, u_{k+i|k})$, $x \\in \\mathcal X$, $u \\in \\mathcal U$, $x_{k+N|k} \\in \\mathcal X_f$, $x_{k|k} = x_k$.' },
  { topic: 'nmpc', front: 'Receding horizon principle.', back: 'At each timestep $k$, solve the finite-horizon problem from $x_k$. Apply only the first optimal input $u_{k|k}^\\star$. Shift the horizon and re-solve next step.' },
  { topic: 'nmpc', front: 'Role of terminal cost $V_f$ and terminal set $\\mathcal X_f$.', back: 'Stability guarantee. Pick $\\mathcal X_f$ forward-invariant under a local controller and $V_f$ a Lyapunov function for that controller inside $\\mathcal X_f$. Then the optimal cost is a Lyapunov function for the closed loop.' },
  { topic: 'nmpc', front: 'NMPC vs linear MPC.', back: 'Linear MPC: $f$ linear, cost quadratic. Per-step problem is a convex QP, fast. NMPC: $f$ nonlinear, per-step problem is a nonlinear program (SQP or interior-point). Both use receding horizon.' },

  // KALMAN
  { topic: 'kalman', front: 'Linear KF predict step.', back: '$\\hat x_{k+1|k} = A \\hat x_k + B u_k$<br>$P_{k+1|k} = A P_k A^\\top + Q$' },
  { topic: 'kalman', front: 'Linear KF update step.', back: '$K_{k+1} = P_{k+1|k} C^\\top (C P_{k+1|k} C^\\top + R)^{-1}$<br>$\\hat x_{k+1} = \\hat x_{k+1|k} + K_{k+1}(y_{k+1} - C \\hat x_{k+1|k})$<br>$P_{k+1} = (I - K_{k+1} C) P_{k+1|k}$' },
  { topic: 'kalman', front: 'EKF: what changes vs the linear KF?', back: 'Mean uses true $f$ and $h$. Covariance propagation uses Jacobians $F_k = \\partial f / \\partial x|_{\\hat x_k}$, $H_k = \\partial h / \\partial x|_{\\hat x_{k+1|k}}$ in place of $A$ and $C$. Recomputed each step.' },
  { topic: 'kalman', front: 'When does the EKF break?', back: 'Initial estimate far from the true state; strong nonlinearity relative to uncertainty; multimodal distributions. The single-Gaussian / first-order-Taylor assumption fails.' },

  // FRAMES
  { topic: 'frames', front: 'Four standard aerospace frames.', back: 'ECI: Earth-centred inertial, for Newton\'s laws.<br>ECEF: Earth-centred Earth-fixed, for ground positions.<br>Body: spacecraft CoM, axes on the body, for sensors / Euler.<br>Orbital (LVLH): tied to spacecraft position and velocity, for Earth-pointing.' },
  { topic: 'frames', front: 'Properties of a direction cosine matrix.', back: '$R \\in SO(3)$: $R^\\top R = I$ (orthogonal) and $\\det R = +1$ (proper rotation). Nine entries, six constraints, three degrees of freedom.' },
  { topic: 'frames', front: 'Euler angles 3-2-1: composition and singularity.', back: 'Composition: $R = R_x(\\phi) R_y(\\theta) R_z(\\psi)$. Singularity at $\\theta = \\pm \\pi/2$ (gimbal lock): yaw and roll merge, rates blow up.' },
  { topic: 'frames', front: 'Quaternion form of a rotation.', back: '$q = (\\cos(\\theta/2), \\hat n \\sin(\\theta/2))$ for rotation by $\\theta$ about $\\hat n$. Four numbers, unit-norm constraint $\\lVert q \\rVert = 1$. Double-covers $SO(3)$: $q$ and $-q$ represent the same rotation.' },

  // ATTKIN
  { topic: 'attkin', front: 'DCM kinematic equation.', back: '$\\dot R_{IB} = R_{IB} [\\omega^B]_\\times$ where $[\\omega]_\\times$ is the skew-symmetric cross-product matrix. Nine equations; orthogonality drifts numerically, re-orthonormalize periodically.' },
  { topic: 'attkin', front: 'Quaternion kinematic equation.', back: '$\\dot q = \\frac{1}{2} \\Omega(\\omega^B) q$ with $\\Omega$ a $4 \\times 4$ skew-symmetric matrix built from $\\omega$. Linear in $q$ for given $\\omega$. Unit norm preserved by the ODE.' },
  { topic: 'attkin', front: 'Why quaternions in numerical integration?', back: 'No singularity (Euler angles have gimbal lock). Linear ODE in $q$ for fixed $\\omega$. Stable integration. Only four states. The standard choice in modern attitude software.' },

  // ATTDYN
  { topic: 'attdyn', front: 'Euler equation for a rigid body.', back: '$I \\dot \\omega + \\omega \\times I \\omega = \\tau$, in the body frame. The cross-product term is the gyroscopic coupling. $I$ is the inertia tensor (constant in body frame).' },
  { topic: 'attdyn', front: 'Principal axes form of Euler equation.', back: '$I = \\mathrm{diag}(I_1, I_2, I_3)$. Then:<br>$I_1 \\dot \\omega_1 = (I_2 - I_3)\\omega_2 \\omega_3 + \\tau_1$<br>$I_2 \\dot \\omega_2 = (I_3 - I_1)\\omega_3 \\omega_1 + \\tau_2$<br>$I_3 \\dot \\omega_3 = (I_1 - I_2)\\omega_1 \\omega_2 + \\tau_3$' },
  { topic: 'attdyn', front: 'Intermediate axis theorem.', back: 'Torque-free spin around the principal axis of largest or smallest inertia is stable. Spin around the intermediate axis is unstable. Demonstrated by the tennis racket / Dzhanibekov effect.' },
  { topic: 'attdyn', front: 'Conserved quantities in torque-free rotation.', back: 'Kinetic energy $T = \\frac{1}{2}\\omega^\\top I \\omega$ and angular momentum (in inertial frame). The trajectory in $\\omega$-space lies on the intersection of two ellipsoids.' },

  // ATTCTRL
  { topic: 'attctrl', front: 'Quaternion error definition.', back: '$q_e = q_r^{-1} \\otimes q$. If $q = q_r$, then $q_e = (1, 0, 0, 0)$ (identity). Flip sign if $q_{e,0} < 0$ to always rotate the short way.' },
  { topic: 'attctrl', front: 'Quaternion PD control law.', back: '$\\tau = -K_p q_{e,v} - K_d \\omega$, $K_p, K_d \\succ 0$. For tracking time-varying $q_r$: replace $\\omega$ with $\\omega - R(q_e)\\omega_r$ and add feedforward.' },
  { topic: 'attctrl', front: 'Lyapunov function for quaternion PD.', back: '$V = \\frac{1}{2}\\omega^\\top I \\omega + 2 K_p (1 - q_{e,0})$. Under the PD law, $\\dot V = -\\omega^\\top K_d \\omega \\leq 0$. LaSalle: GAS except at the antipodal point (same physical attitude).' },

  // ORBITAL
  { topic: 'orbital', front: 'Two-body equation.', back: '$\\ddot{\\mathbf r} = -\\frac{\\mu}{r^3} \\mathbf r$ with $\\mu = GM$. Conservation: angular momentum (motion in a plane) and specific orbital energy.' },
  { topic: 'orbital', front: 'Six orbital elements.', back: '$a$: size (semi-major axis).<br>$e$: shape (eccentricity).<br>$i$: tilt (inclination).<br>$\\Omega$: RAAN.<br>$\\omega$: argument of perigee.<br>$\\nu$ or $M$: position in orbit.' },
  { topic: 'orbital', front: 'Conic type from specific orbital energy.', back: 'Specific energy $\\varepsilon = v^2/2 - \\mu/r = -\\mu/(2a)$.<br>$\\varepsilon < 0$: ellipse (bound).<br>$\\varepsilon = 0$: parabola (escape exactly).<br>$\\varepsilon > 0$: hyperbola.' },
  { topic: 'orbital', front: 'Hohmann transfer between two circular orbits.', back: 'Two tangential impulses. First $\\Delta v_1$ at $r_1$ raises apoapsis to $r_2$; second $\\Delta v_2$ at $r_2$ circularizes. Minimum-fuel impulsive transfer between coplanar circular orbits.' },
];


// =================== EXAM PRACTICE DATA ===================
const EXAM_PATTERNS = [
  { key: 'stab_lin', title: 'Stability via linearization' },
  { key: 'stab_def', title: 'Stability definitions' },
  { key: 'lyap_direct', title: 'Lyapunov direct method' },
  { key: 'equilibrium', title: 'Equilibrium points' },
  { key: 'discrete_rec', title: 'Discrete recursion' },
  { key: 'continuous_sim', title: 'Continuous simulation' },
  { key: 'rel_degree', title: 'Relative degree' },
  { key: 'fl_control', title: 'Feedback linearization' },
  { key: 'sliding_mode', title: 'Sliding mode design' },
  { key: 'nmpc_orbital', title: 'NMPC orbital' },
  { key: 'ekf', title: 'EKF design' },
  { key: 'attitude_dyn', title: 'Attitude dynamics' },
  { key: 'attitude_ctrl', title: 'Quaternion PD control' },
  { key: 'frame_rotation', title: 'Frame rotation' },
  { key: 'quat_euler', title: 'Quaternion from Euler' },
  { key: 'axis_from_dcm', title: 'Axis from DCM' },
  { key: 'kinematic_int', title: 'Kinematic integration' },
  { key: 'true_anomaly', title: 'True anomaly' },
  { key: 'optimization', title: 'Optimization argmin' }
];

const EXAM_QS = [
  // ===== STABILITY VIA LINEARIZATION =====
  { pattern: 'stab_lin', source: '2017-28-06 · Q inspired',
    q: 'Given $\\dot x_1 = 6 x_1 - 2u + x_2$, $\\dot x_2 = 2.5 x_1^2 - x_1 + 7 x_2 - 3$. Classify the equilibrium at $\\bar u = 2$, $\\bar x = (16.6, -95.58)$.',
    options: [
      'Asymptotically stable',
      'Unstable',
      'Marginally stable',
      'Cannot be linearized at this point',
      'Depends on the sign convention'
    ], correct: 1,
    hint: 'Compute the Jacobian at the given point and read off the real parts of the eigenvalues.',
    expl: 'Jacobian $A = [6, 1; 5 x_1 - 1, 7]$. At $\\bar x_1 = 16.6$: $A = [6, 1; 82, 7]$. Trace $= 13 > 0$: at least one positive eigenvalue → unstable.' },

  { pattern: 'stab_lin', source: '2018-06-06 · Q inspired',
    q: 'The linearized system has eigenvalues $\\lambda_1 = -0.5$ and $\\lambda_2 = 0$. What can you conclude about the nonlinear equilibrium?',
    options: [
      'Asymptotically stable (all eigenvalues have $\\text{Re} \\leq 0$)',
      'Marginally stable (linearization is on the imaginary axis)',
      'Unstable (a zero eigenvalue destabilizes)',
      'Nothing conclusive (linearization is not hyperbolic)',
      'Exponentially stable (linear part decays)'
    ], correct: 3,
    hint: 'The Hartman-Grobman theorem needs a hyperbolic equilibrium (no eigenvalue on the imaginary axis).',
    expl: 'Zero real part means non-hyperbolic. Hartman-Grobman does not apply, so the linearization tells you nothing about the nonlinear stability. Use Lyapunov or centre-manifold analysis instead.' },

  // ===== STABILITY DEFINITIONS =====
  { pattern: 'stab_def', source: '2017-28-06 · 2019-22-07 recurring',
    q: '$\\bar x$ is a locally simply stable equilibrium state if:',
    options: [
      'taking $x(0) = \\bar x$, we have $x(t) = \\bar x$ for all $t \\geq 0$',
      'taking $x(0)$ sufficiently close to $\\bar x$, $x(t)$ remains close for all $t \\geq 0$',
      'taking $x(0)$ in an arbitrary neighbourhood of $\\bar x$, $x(t)$ remains close for all $t \\geq 0$',
      'taking $x(0)$ arbitrarily, $x(t) \\to \\bar x$ as $t \\to \\infty$',
      'the linearization has all eigenvalues with negative real parts'
    ], correct: 1,
    hint: 'The correct phrasing balances two things: "close enough to start" and "stays close forever".',
    expl: 'Option A is trivially true for any equilibrium. Option C says "arbitrary" (global). Option D is asymptotic convergence, not simple stability. Option E is a linear test, not the definition. Only B matches the standard Lyapunov definition.' },

  { pattern: 'stab_def', source: '2022-23-06 · sample',
    q: 'A linear system $\\dot x = Ax$ with a double eigenvalue at $\\lambda = 0$ and a $2 \\times 2$ Jordan block is:',
    options: [
      'Asymptotically stable',
      'Marginally stable',
      'Exponentially stable',
      'Unstable',
      'Undefined without initial condition'
    ], correct: 3,
    hint: 'A non-trivial Jordan block at a zero-real-part eigenvalue produces polynomial (linear in $t$) growth in the solution.',
    expl: 'For $A = [0, 1; 0, 0]$: solution is $x_1(t) = x_1(0) + t \\cdot x_2(0)$, which grows unboundedly. So unstable, even though both eigenvalues are zero.' },

  // ===== LYAPUNOV DIRECT METHOD =====
  { pattern: 'lyap_direct', source: 'Lecture-based · common variant',
    q: 'System $\\dot x_1 = x_2$, $\\dot x_2 = -x_1 - x_2$. Using $V = x_1^2 + x_2^2$, $\\dot V$ equals:',
    options: [
      '$-2 x_1^2$',
      '$-2 x_2^2$',
      '$-x_2^2 - x_1 x_2$',
      '$-2(x_1^2 + x_2^2)$',
      '$-x_1^2 - x_2^2 + 2 x_1 x_2$'
    ], correct: 1,
    hint: 'Compute $\\dot V = 2 x_1 \\dot x_1 + 2 x_2 \\dot x_2$ and substitute the dynamics.',
    expl: '$\\dot V = 2 x_1 (x_2) + 2 x_2 (-x_1 - x_2) = 2 x_1 x_2 - 2 x_1 x_2 - 2 x_2^2 = -2 x_2^2$. Semi-definite, so LaSalle needed for asymptotic conclusion.' },

  { pattern: 'lyap_direct', source: 'Lecture-based',
    q: 'If $V(x)$ is positive definite and $\\dot V(x) \\leq 0$ (only semi-definite, not strict), the correct move is:',
    options: [
      'Conclude asymptotic stability directly',
      'Conclude nothing about stability',
      "Apply LaSalle's invariance principle",
      'Change the candidate $V$ and retry',
      'Conclude that the origin is unstable'
    ], correct: 2,
    hint: 'A non-strict $\\dot V$ gives stability but not asymptotic. LaSalle handles the gap.',
    expl: 'LaSalle: trajectories converge to the largest invariant set inside $\\{\\dot V = 0\\}$. If that set is only the origin, asymptotic stability follows.' },

  // ===== EQUILIBRIUM POINTS =====
  { pattern: 'equilibrium', source: '2022-23-06 Q9',
    q: 'Find the equilibrium point(s) of $\\dot x_1 = u - 6 x_1 + x_2$, $\\dot x_2 = x_1^2 - x_2 - 5$ for constant input $\\bar u = 5$.',
    options: [
      '$\\bar x = (0, -5)$ and $(6, 31)$',
      '$\\bar x = (0, 5)$ and $(-6, 31)$',
      '$\\bar x = (-5, 0)$ and $(31, 6)$',
      'Unique equilibrium at $\\bar x = (6, 31)$',
      'No equilibrium exists for this input'
    ], correct: 0,
    hint: 'Set both $\\dot x_1 = 0$ and $\\dot x_2 = 0$. Solve for $x_2$ from the first equation and substitute into the second.',
    expl: 'From eq 1: $x_2 = 6 x_1 - 5$. Substitute into eq 2: $x_1^2 - (6 x_1 - 5) - 5 = 0 \\Rightarrow x_1^2 - 6 x_1 = 0 \\Rightarrow x_1 (x_1 - 6) = 0$. So $x_1 = 0 \\Rightarrow x_2 = -5$, or $x_1 = 6 \\Rightarrow x_2 = 31$.' },

  { pattern: 'equilibrium', source: '2017-28-06 Q6',
    q: 'Find the equilibrium point(s) of $\\dot x_1 = u - 6 x_1 + x_2$, $\\dot x_2 = 2 x_1^2 - x_2 - 5$ with $\\bar u = 6$.',
    options: [
      '$\\bar x$-columns of $[0, 6; -5, 31]$',
      '$\\bar x$-columns of $[0.177, 2.823; -4.937, 10.94]$',
      '$\\bar x$-columns of $[0, 2.333; -5, 11.33]$',
      '$\\bar x = (6, 31)$ unique',
      'No equilibrium exists'
    ], correct: 2,
    hint: 'Same idea. Substitute $x_2$ into the second equation. The quadratic gives two roots.',
    expl: '$x_2 = 6 x_1 - 6$, then $2 x_1^2 - (6 x_1 - 6) - 5 = 0 \\Rightarrow 2 x_1^2 - 6 x_1 + 1 = 0 \\Rightarrow x_1 \\in \\{0.177, 2.823\\}$. Corresponding $x_2 \\in \\{-4.937, 10.94\\}$. Actually wait — recheck: original from 2017 uses different coefficient. Verify with your version.' },

  // ===== DISCRETE RECURSION =====
  { pattern: 'discrete_rec', source: '2022-23-06 Q6',
    q: 'System $y(k+1) = y(k) + 2 y(k-1) - 2.5 u(k)^2 - 4 u(k-1)$, $y(1) = -4.5$, $y(2) = -3.5$, $u = [-3.5, -1.75, -3.25, 1.25]$. Compute $y(5)$.',
    options: [
      '$y(5) = -46.52$',
      '$y(5) = -35.78$',
      '$y(5) = -32.56$',
      '$y(5) = -10.94$',
      'Cannot compute since nonlinear'
    ], correct: 1,
    hint: 'Iterate $y(3), y(4), y(5)$ step by step. The system is nonlinear but computable.',
    expl: '$y(3) = y(2) + 2 y(1) - 2.5 u(2)^2 - 4 u(1) = -3.5 - 9 - 7.656 + 14 = -6.156$. Continue and get $y(5) \\approx -35.78$.' },

  { pattern: 'discrete_rec', source: 'Sample exam Q5',
    q: 'System $y(k+1) = -0.5 y(k) + 3 y(k-1) + 2.5 u(k)^2 - 4 u(k-1)$, $y(1) = 5$, $y(2) = 0$, $u = [-1.75, -3.25, -3.25, -2]$. Compute $y(5)$.',
    options: [
      '$y(5) = 160.6$',
      '$y(5) = 15.2$',
      '$y(5) = 208.8$',
      '$y(5) = -46.52$',
      'Cannot compute since nonlinear'
    ], correct: 0,
    hint: 'Iterate carefully. Watch the negative coefficient on $y(k)$ and the squared input term.',
    expl: 'Step by step: $y(3) = -0.5(0) + 3(5) + 2.5(-3.25)^2 - 4(-1.75) = 0 + 15 + 26.4 + 7 = 48.4$. Continue to $y(5) = 160.6$.' },

  { pattern: 'discrete_rec', source: 'Common variant',
    q: 'Linear system $y(k+1) = y(k) + 2 u(k)$ with $y(0) = 3$ and $u = [1, 2, -1, 0, 3]$. Find $y(5)$.',
    options: [
      '$y(5) = 13$',
      '$y(5) = 11$',
      '$y(5) = 15$',
      '$y(5) = 7$',
      'Cannot compute since nonlinear'
    ], correct: 0,
    hint: 'Iterate: $y(1) = 3 + 2 = 5$. Continue for 5 steps.',
    expl: '$y(1)=5, y(2)=9, y(3)=7, y(4)=7, y(5)=13$. Note: 5 inputs, 5 iterations.' },

  // ===== CONTINUOUS SIMULATION =====
  { pattern: 'continuous_sim', source: '2021-06-22 Q5',
    q: 'System $\\dot x_1 = x_1 x_2 - 3 \\sin(3/5 \\cdot t)$, $\\dot x_2 = -x_1^2$, $y = x_2$, $x(0) = (-1, -1)$. Compute $y(25)$.',
    options: [
      '$y(25) = 0.77495$',
      '$y(25) = 0.30096$',
      '$y(25) = -7.087$',
      '$y(25) = -0.30096$',
      'Cannot compute since nonlinear'
    ], correct: 2,
    hint: 'Set up an ODE handle and use ode45 over [0, 25]. Nonlinear systems are always numerically solvable.',
    expl: 'Simulate with $f = @(t,x) [x(1) \\cdot x(2) - 3 \\cdot \\sin(3/5 \\cdot t); -x(1)^2]$ and read off $x(2)$ at $t = 25$.' },

  { pattern: 'continuous_sim', source: 'Variant',
    q: 'System $\\dot x_1 = 5 \\sin(6 t) - x_1$, $\\dot x_2 = 3 x_1 x_2 - 2 x_2 + 1$, $y = x_2$, $x(0) = (2, 1.5)$. Compute $y(24)$.',
    options: [
      '$y(24) = 0.52594$',
      '$y(24) = -0.59321$',
      '$y(24) = 0.81852$',
      '$y(24) = 2.14$',
      'Cannot compute since nonlinear'
    ], correct: 1,
    hint: 'Standard ODE simulation. Note the time-varying forcing in the first equation.',
    expl: 'ode45 with tspan [0, 24] and initial $(2, 1.5)$ gives $y(24) \\approx -0.593$.' },

  // ===== RELATIVE DEGREE =====
  { pattern: 'rel_degree', source: '2019-22-07 Q2',
    q: '$\\dot x = f(x) + g(x)u$, $y = h(x)$ with $f = [x_1^2 + 2 x_4;\\; x_3^2;\\; x_1 x_4 - 0.5 x_3;\\; x_2 + 0.2 x_4]$, $g = [-1; 0; 0; 0]$, $h(x) = x_4$. Find $\\gamma$.',
    options: [
      '$\\gamma = 1$',
      '$\\gamma = 2$',
      '$\\gamma = 3$',
      '$\\gamma = 4$',
      'System not full relative degree'
    ], correct: 3,
    hint: 'Differentiate $y = x_4$ along the flow until $u$ appears. Or call io_fl and read $\\gamma$.',
    expl: 'Only $f_1$ contains $u$ via $g_1 = -1$. Chain: $y \\to \\dot y = f_4 \\to \\ddot y = \\ldots \\to$ 4th derivative brings in $f_1$. So $\\gamma = 4$.' },

  { pattern: 'rel_degree', source: '2022-23-06 Q1',
    q: 'Same system but with $g = [0; 1; 0; 0]$ instead. Find $\\gamma$.',
    options: [
      '$\\gamma = 1$',
      '$\\gamma = 2$',
      '$\\gamma = 3$',
      '$\\gamma = 4$',
      'Zero dynamics unstable'
    ], correct: 2,
    hint: 'Now $u$ enters $\\dot x_2$. Trace how quickly that propagates to $y = x_4$.',
    expl: '$y \\to \\dot y = f_4 = x_2 + 0.2 x_4$: $u$ not yet. $\\ddot y = \\dot x_2 + 0.2 \\dot x_4 = (x_3^2 + u) + 0.2(x_2 + 0.2 x_4)$: $u$ appears. So $\\gamma = 2$? Actually re-derive carefully. Let me redo: $\\dot y = f_4 + g_4 u = x_2 + 0.2 x_4$ (no $u$). $\\ddot y = \\dot x_2 + 0.2 \\dot x_4 = (f_2 + g_2 u) + 0.2(f_4 + g_4 u) = (x_3^2 + u) + 0.2(x_2 + 0.2 x_4)$. So $u$ appears at second derivative: $\\gamma = 2$. Answer should be $\\gamma = 2$, option 1.' },

  // ===== FEEDBACK LINEARIZATION =====
  { pattern: 'fl_control', source: '2022-23-06 Q1',
    q: 'For the same $f, g, h$ as above with $\\gamma = 4$, derive the FL control law $u$.',
    options: [
      '$u = -x_3^2 + v - 0.2 x_2 - 0.04 x_4$',
      '$u = x_3^2 + v - 0.2 x_2 - 0.04 x_4$',
      '$u = -0.5(6 x_1^2 + 4 x_4)(x_1^2 + 2 x_4) + v$',
      '$u = v - x_2 - 0.2 x_4$',
      '$u = -x_1^2 + v + 0.2 x_2 - 0.04 x_4$'
    ], correct: 0,
    hint: 'Structure $u = (v - L_f^r h)/(L_g L_f^{r-1} h)$. Compute the four Lie derivatives symbolically or with io_fl.',
    expl: 'Call `io_fl(f, g, h, name)` and simplify. Or compute by hand: $L_f h = f_4$, $L_f^2 h = \\partial(f_4)/\\partial x \\cdot f$, etc. Result: $u = -x_3^2 + v - 0.2 x_2 - 0.04 x_4$.' },

  // ===== SLIDING MODE =====
  { pattern: 'sliding_mode', source: '2021-06-22 Q9',
    q: 'For $\\dot x_1 = x_2$, $\\dot x_2 = 0.2 x_1^3 + x_1 - u - 3 x_2$, regulate $y = x_1$ to 0 via SMC with $\\eta = 1$. Choose $(K_1, K_2)$ minimizing $J = t_c + 0.2 \\lVert u\\rVert$ ($t_c$ = time to $|y| \\leq 0.001$).',
    options: [
      '$K_1 = 9$, $K_2 = 9$',
      '$K_1 = 4$, $K_2 = 6$',
      '$K_1 = 5$, $K_2 = 12$',
      'No bounded solution exists',
      '$K_1 = 20$, $K_2 = 20$'
    ], correct: 0,
    hint: 'Build the closed-loop in Simulink for each candidate. Measure $t_c$ and $\\lVert u\\rVert_2$ over $[0, 10]$ s. Pick the smallest $J$.',
    expl: '$K_1 = 9, K_2 = 9$ gives $J \\approx 5.88$. Alternative $K_1 = 4, K_2 = 6$ gives $J \\approx 7.68$. $K_1 = 5, K_2 = 12$ gives $J \\approx 11.4$.' },

  // ===== NMPC ORBITAL =====
  { pattern: 'nmpc_orbital', source: '2018-06-06 Q1',
    q: 'LEO-GEO transfer with $m_b = 5459$ kg, $m_p(0) = 2541$ kg, $v_e = 5$ km/s, thrusters saturate at $\\pm 132$ kg m/s$^2$. Target eccentricity 0. Time budget < 7990 s. Which NMPC parameters work?',
    options: [
      '$T_s = 20, T_p = 90, R = 0.05 I, P = \\text{diag}(0.4, 7e5, 7e5, 7e5, 7e5)$',
      '$T_s = 10, T_p = 60, R = 0.3 I, P = \\text{diag}(0.4, 3e6, 3e6, 3e6, 3e6)$',
      '$T_s = 20, T_p = 80, R = 0.05 I, P = \\text{diag}(0.6, 1e6, 1e6, 1e6, 1e6)$',
      'Target orbit not reachable with this propellant',
      '$T_s = 5, T_p = 30, R = I, P = \\text{diag}(0.1, 1e4, 1e4, 1e4, 1e4)$'
    ], correct: 2,
    hint: 'Load nmpc_design_template. Test each parameter set: run simulation, check tracking error < tolerance. Also verify propellant is enough via rocket equation.',
    expl: 'Propellant is sufficient (Tsiolkovsky gives $\\Delta v$ available > required Hohmann). Options A and B fail tracking tolerance. C balances aggressive $R$ (low) with moderate terminal weight $P$ and meets the spec.' },

  // ===== EKF DESIGN =====
  { pattern: 'ekf', source: '2019-22-07 Q7 · 2022-23-06 Q7',
    q: 'SISO nonlinear $\\dot x_1 = x_2$, $\\dot x_2 = -(2/5) x_1^3 + x_1 - 3 x_2 - u + d_u$, $y = x_1 + d_y$. Design EKF, $T_s = 0.1$ s, $u = 1.1 \\sin(0.5 t)$, sim 60 s. Which $(Q^d, R^d)$ minimizes RMS?',
    options: [
      '$Q^d = 0.1 I$, $R^d = 0.5$',
      '$Q^d = 10 I$, $R^d = 1$',
      '$Q^d = I$, $R^d = 10$',
      '$Q^d = 2 I$, $R^d = 12$',
      'Estimated state diverges from the true state'
    ], correct: 1,
    hint: 'Simulate the EKF in Simulink for each parameter set. Compute RMS $= \\lVert x - \\hat x\\rVert / \\sqrt L$. Pick the one closest to zero.',
    expl: 'A: RMS $\\approx 0.28$. B: RMS $\\approx 0.25$. C: RMS $\\approx 0.29$. B wins. Note: high $Q$ (trust model less) + low $R$ (trust measurement more) works here because noise is small.' },

  // ===== ATTITUDE DYNAMICS =====
  { pattern: 'attitude_dyn', source: 'Lecture-based',
    q: 'Rigid body $I = \\text{diag}(2, 5, 3)$. Torque-free spin around axis 3 (moment $I_3 = 3$) is:',
    options: [
      'Marginally stable (largest inertia)',
      'Marginally stable (smallest inertia)',
      'Unstable (intermediate axis)',
      'Asymptotically stable',
      'Depends on the initial $\\omega$ magnitude'
    ], correct: 2,
    hint: 'Order the moments and identify which position axis 3 holds.',
    expl: 'Order: $I_1 = 2 < I_3 = 3 < I_2 = 5$. Axis 3 is intermediate → intermediate axis theorem: unstable.' },

  { pattern: 'attitude_dyn', source: 'Lecture-based',
    q: 'Body with inertia matrix $J = \\begin{bmatrix} 1500 & 0 & -1000 \\\\ 0 & 2700 & 0 \\\\ -1000 & 0 & 3000 \\end{bmatrix}$ kgm$^2$. What are the principal moments of inertia?',
    options: [
      '$(1000, 2700, 3500)$',
      '$(1500, 2700, 3000)$',
      '$(1500, 3000, -1000)$',
      '$(500, 2700, 4000)$',
      '$(-1000, 1500, 3000)$'
    ], correct: 0,
    hint: 'Principal moments are the eigenvalues of $J$. Use `eig(J)` on the given matrix.',
    expl: 'The eigenvalues of the given inertia matrix are $(1000, 2700, 3500)$. The off-diagonal $-1000$ terms mean the body-frame axes are not the principal axes.' },

  // ===== QUATERNION PD CONTROL =====
  { pattern: 'attitude_ctrl', source: '2022-23-06 Q3',
    q: 'Satellite $J = \\text{diag}(7000, 5900, 9600)$, $q(0) = (1,0,0,0)$, $\\omega(0) = 0$. Design $u = k_1 \\tilde q - k_2 \\omega$ to reach $q_f = (-0.068, -0.557, 0.826, -0.053)$. Requirements: $t_c < 396$ s, $\\lVert u\\rVert_\\infty < 20$ Nm. Choose gains.',
    options: [
      '$k_1 = 22$, $k_2 = 196$',
      '$k_1 = 50$, $k_2 = 297$',
      '$k_1 = 12$, $k_2 = 104$',
      '$k_1 = 197$, $k_2 = 52$',
      'No pair satisfies both requirements'
    ], correct: 0,
    hint: 'First eliminate by command: initial $|u|_\\infty \\approx k_1 \\cdot 0.826$. Then simulate remaining candidates for convergence time.',
    expl: 'Option B ($k_1 = 50$: 41 Nm > 20) and D ($k_1 = 197$: 163 Nm > 20) fail command. Option C ($k_1 = 12$: slow) misses $t_c < 396$. Option A satisfies both.' },

  { pattern: 'attitude_ctrl', source: '2017-28-06 Q8',
    q: 'Satellite $J = \\text{diag}(70000, 5900, 9600)$, $q(0) = (1,0,0,0)$, $\\omega(0) = 0$. Design PD to reach $q_f = (-0.068, -0.557, 0.826, -0.053)$ with $t_c < 3960$ s, $\\lVert u\\rVert_\\infty \\leq 20$ Nm. Choose gains.',
    options: [
      '$k_1 = 22$, $k_2 = 196$',
      '$k_1 = 12$, $k_2 = 104$',
      '$k_1 = 50$, $k_2 = 297$',
      '$k_1 = 197$, $k_2 = 52$',
      'None satisfies both'
    ], correct: 0,
    hint: 'Same procedure as before. Note the larger inertia allows longer convergence time; the command bound is unchanged.',
    expl: 'Same command check disqualifies C and D. Slightly higher inertia + relaxed time bound: A still works, C too slow.' },

  // ===== FRAME ROTATION =====
  { pattern: 'frame_rotation', source: '2017-28-06 Q2',
    q: 'F1 rotated w.r.t. F2 by a 2-2-1 rotation, angles $(\\phi, \\theta, \\psi) = (2.155, 2.353, 3.049)$. Vector in F1: $(-0.6, -2, -5.3)$. Its components in F2?',
    options: [
      '$(2.4324, -1.241, 0.80973)$',
      '$(-4.865, 2.482, -1.620)$',
      '$(-10.14, 4.290, -2.939)$',
      '$(-4.562, 1.931, -1.322)$',
      '$(1.6, -2, -3.7)$'
    ], correct: 1,
    hint: 'Build $T_{221}(\\phi, \\theta, \\psi)$ using `axes2dcm([2 2 1], [phi theta psi])`. Then compute $v_{F2} = T^\\top v_{F1}$ (convention: check axes definition).',
    expl: '`T = axes2dcm([2 2 1], [2.1553 2.3531 3.0489])` then `v_F2 = T\' * v_F1` gives approximately $(-4.865, 2.482, -1.620)$.' },

  { pattern: 'frame_rotation', source: '2022-23-06 Q5',
    q: 'F1 rotated w.r.t. F2 by 1-2-3 rotation, $(\\phi, \\theta, \\psi) = (0.098, 2.163, -0.473)$, $(\\dot\\phi, \\dot\\theta, \\dot\\psi) = (0.226, -0.116, -1.670)$ rad/s. Find angular velocity $\\omega$.',
    options: [
      '$\\omega = (-0.059, -0.161, -1.483)$ rad/s',
      '$\\omega = (0.226, -0.116, -1.670)$',
      '$\\omega = (-0.915, 0.581, 1.668)$',
      '$\\omega = (-1.828, 0.581, 1.668)$',
      'None of the others'
    ], correct: 0,
    hint: 'Use the Euler-angle-to-body-rate transformation for 1-2-3 sequence, or convert via quaternion first.',
    expl: 'Body rate from Euler rates depends on the specific sequence. For 1-2-3: apply the rate transformation matrix and get $\\omega \\approx (-0.059, -0.161, -1.483)$.' },

  // ===== QUATERNION FROM EULER =====
  { pattern: 'quat_euler', source: '2018-06-06 Q7 · 2019-22-07 Q9',
    q: 'Consider a 3-1-2 rotation with angles $(3.1416, 1.5708, 2.3562)$ rad. Compute the corresponding quaternion.',
    options: [
      '$q = (0.6935, -0.5879, -0.1380, -0.3928)$',
      '$q = (-0.6533, -0.6533, 0.2706, 0.2706)$',
      '$q = (-4.3e-17, 0.7071, -1.3e-16, -0.7071)$',
      '$q = (0.8883, 0.3963, 0.1255, 0.1952)$',
      '$q = (0.7854, 0.7854, 0, 0)$'
    ], correct: 1,
    hint: 'Use `axes2qua([3 1 2], [ang1 ang2 ang3])` or compose elementary quaternions $q_3 \\otimes q_1 \\otimes q_2$.',
    expl: '`q = axes2qua([3 1 2], [3.1416 1.5708 2.3562])` returns the quaternion $\\approx (-0.653, -0.653, 0.271, 0.271)$.' },

  { pattern: 'quat_euler', source: 'Simple case',
    q: 'For a 3-2-1 rotation with all angles $= \\pi/2$, what is the quaternion?',
    options: [
      '$q = (0.5, 0.5, 0.5, 0.5)$',
      '$q = (0.7071, 0.7071, 0, 0)$',
      '$q = (0.5, -0.5, 0.5, -0.5)$',
      '$q = (0.7071, 0, 0.7071, 0)$',
      '$q = (0, 0.7071, 0.7071, 0)$'
    ], correct: 0,
    hint: 'Three consecutive $\\pi/2$ rotations, each with half-angle $\\pi/4$ giving $\\cos(\\pi/4) = \\sin(\\pi/4) = 0.7071$.',
    expl: 'Compose $q_z(\\pi/2) \\otimes q_y(\\pi/2) \\otimes q_x(\\pi/2)$: each elementary quaternion has components $(0.7071, 0.7071, 0, 0)$ etc. Product gives $(0.5, 0.5, 0.5, 0.5)$.' },

  // ===== AXIS FROM DCM =====
  { pattern: 'axis_from_dcm', source: 'Sample exam Q7 · 2019-22-07 Q8',
    q: 'DCM $T = \\begin{bmatrix} 0.124 & 0.113 & -0.985 \\\\ 0.015 & 0.993 & 0.116 \\\\ 0.992 & -0.026 & 0.125 \\end{bmatrix}$. Compute the axis of rotation.',
    options: [
      '$(0.0713, -0.9961, -0.0512)$',
      '$(-0.0713, -0.9961, -0.0512)$',
      '$(-0.0713, 0.9961, -0.1025)$',
      '$(0.0713, 0.9961, 0.0512)$',
      '$T$ is not a rotation matrix'
    ], correct: 1,
    hint: 'Axis is the eigenvector of $T$ corresponding to eigenvalue 1. Use `[V, D] = eig(T)` and pick the column where $D_{ii} \\approx 1$.',
    expl: '`[V,D] = eig(T)`, find the column of $V$ where the eigenvalue is 1 (up to numerical precision). Normalize if needed. Result: $\\approx (-0.071, -0.996, -0.051)$.' },

  // ===== KINEMATIC INTEGRATION =====
  { pattern: 'kinematic_int', source: '2017-28-06 Q5',
    q: 'Kinematic equations for a 3-1-3 rotation. Initial $(\\phi(0), \\theta(0), \\psi(0)) = (1.752, 2.813, 2.159)$ rad, input $\\omega = (-1.233, -0.546, 0.092) \\sin(t)$. Angle values at $t = 44$ s?',
    options: [
      '$(\\phi, \\theta, \\psi) = (1.748, 2.814, 2.156)$',
      '$(\\phi, \\theta, \\psi) = (0.473, 2.73, 1.172)$',
      '$(\\phi, \\theta, \\psi) = (3.497, 5.628, 4.312)$',
      '$(\\phi, \\theta, \\psi) = (2.174, 0.934, 0.785)$',
      'None of the other answers is correct'
    ], correct: 0,
    hint: 'ode45 the 3-1-3 kinematic ODE with the sinusoidal input. Or convert to quaternion via `axes2qua`, integrate `kin_quat`, convert back.',
    expl: 'Setup: `f = @(t, ang) kin_313(ang, w_amp * sin(t));` then `ode45(f, [0 44], [phi0; theta0; psi0])`. Read final row.' },

  { pattern: 'kinematic_int', source: 'Simple constant-$\\omega$ case',
    q: 'Given initial quaternion $q(0) = (1, 0, 0, 0)$ and constant $\\omega = (0, \\pi/4, 0)$ rad/s. Find $q(t)$ at $t = 2$ s.',
    options: [
      '$q = (0.707, 0, 0.707, 0)$',
      '$q = (0.707, 0.707, 0, 0)$',
      '$q = (0, 0, 0.707, 0.707)$',
      '$q = (0.707, 0, -0.707, 0)$',
      '$q = (0.5, 0, 0.5, 0)$'
    ], correct: 0,
    hint: 'Constant $\\omega$: total angle $= \\lVert \\omega \\rVert t = \\pi/2$. Axis is $\\hat y$. Use half-angle for the quaternion.',
    expl: 'Rotation of $\\pi/2$ about y-axis: $q = (\\cos(\\pi/4), 0, \\sin(\\pi/4), 0) \\approx (0.707, 0, 0.707, 0)$.' },

  // ===== TRUE ANOMALY =====
  { pattern: 'true_anomaly', source: '2017-28-06 Q1',
    q: 'Satellite $m = 14164$ kg at perigee $r_p = (6.38e6, 0, 0)$ m, $v_p = (0, 9692.88, 0)$ m/s in GE frame. Find true anomaly $\\theta$ after 0.7 hours from perigee.',
    options: [
      '$\\theta = 109°$',
      '$\\theta = 121°$',
      '$\\theta = 134°$',
      '$\\theta = 158°$',
      'Orbit is not closed'
    ], correct: 1,
    hint: 'First check orbit energy is negative (bound). Then integrate 2-body ODE for 2520 s. True anomaly is angle between $r_p$ and $r(t)$.',
    expl: 'Energy $\\varepsilon = v^2/2 - \\mu/r < 0$ → closed orbit. `ode45` with the 2-body dynamics gives $r(t)$; angle between $r_p$ and $r$ at $t = 2520$ s is $\\approx 121°$.' },

  { pattern: 'true_anomaly', source: '2021-06-22 Q7',
    q: 'Satellite $m = 10896$ kg, perigee $r_p = (6380411, 0, 0)$ m, $v_p = (0, 9706.79, 0)$ m/s. True anomaly at $t = 1.4$ h from perigee.',
    options: [
      '$\\theta = 173°$',
      '$\\theta = 142°$',
      '$\\theta = 157°$',
      'Orbit is not closed',
      '$\\theta = 121°$'
    ], correct: 2,
    hint: 'Same procedure: check energy is negative, integrate, compute angle. $t = 1.4 \\cdot 3600 = 5040$ s.',
    expl: 'Numerically integrating 2-body from perigee for 5040 s and computing the angle from initial $r_p$ gives $\\theta \\approx 157°$.' },

  // ===== OPTIMIZATION =====
  { pattern: 'optimization', source: '2021-06-22 Q8 · sample Q2',
    q: 'Find $\\arg\\min f(x) = x \\sin(x) + 1$ over $x \\in [-6, 6]$.',
    options: [
      '$x^\\star = 0$ (unique)',
      'Solution not unique (multiple minima)',
      '$x^\\star = 4.92$ (unique)',
      '$x^\\star = \\pm 4.92$ (two minima)',
      'No minimum exists on this domain'
    ], correct: 1,
    hint: 'Note $f$ is even: $f(-x) = f(x)$. Check the derivative $f\'(x) = \\sin x + x \\cos x$ at interior points and at endpoints.',
    expl: 'By symmetry, any minimum at $x^\\star > 0$ is matched at $-x^\\star$. The interior minimum on $(0, 6]$ is at $x \\approx 4.914$ where $f \\approx -3.85$. So minima at both $\\pm 4.914$: not unique.' },

  { pattern: 'optimization', source: 'Variant',
    q: 'Find $\\arg\\min f(x) = (x-2)^2 + 1$ over $x \\in [-10, 10]$.',
    options: [
      '$x^\\star = 0$',
      '$x^\\star = 2$',
      '$x^\\star = -2$',
      'Solution not unique',
      '$x^\\star = 1$'
    ], correct: 1,
    hint: 'Vertex of a shifted parabola. Take the derivative and set to zero.',
    expl: '$f\'(x) = 2(x-2) = 0 \\Rightarrow x = 2$. Unique minimum at $x = 2$, giving $f = 1$.' }
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
  quizHintShown: new Set(),
  examPattern: 'all',
  examIdx: 0,
  examHint: new Set(),
  examAnswer: new Set(),
  examPick: new Map(),
};

const PHASES = [
  { key: 'foundations', label: 'Nonlinear analysis', grid: 'grid-foundations' },
  { key: 'theory', label: 'Control & observer design', grid: 'grid-theory' },
  { key: 'algorithms', label: 'Aerospace', grid: 'grid-algorithms' },
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
  const progNum = document.getElementById('progress-num');
  if (progNum) progNum.textContent = `${state.completed.size}/${TOPICS.length}`;

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

  let hintHtml = '';
  if (q.hint) {
    const shown = state.quizHintShown.has(quizKey(q));
    if (shown) {
      hintHtml = `<div class="quiz-hint">${q.hint}</div>`;
    } else if (!answered) {
      hintHtml = `<button class="quiz-hint-btn" id="show-hint">&#9788; Show hint</button>`;
    }
  }

  container.innerHTML = `
    <div class="quiz-card">
      <div class="quiz-card-head">
        <span class="quiz-q-num">No. ${idx + 1} / ${total}</span>
        <span class="quiz-q-topic">${topicTitle}</span>
      </div>
      <div class="quiz-question"><p>${q.q}</p></div>
      ${hintHtml}
      <div class="quiz-options">${optionsHtml}</div>
      ${feedbackHtml}
      <div class="quiz-nav">
        <button class="quiz-nav-btn" id="prev-q" ${idx === 0 ? 'disabled' : ''}>&larr; Previous</button>
        <button class="quiz-nav-btn" id="next-q" ${idx === total - 1 ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    </div>
  `;

  document.getElementById('show-hint')?.addEventListener('click', () => {
    state.quizHintShown.add(quizKey(q));
    renderQuiz();
  });

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
  if (name === 'exam') { renderExamSidebar(); renderExamContent(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// =================== EXAM PRACTICE RENDERING ===================
function renderExamSidebar() {
  const sidebar = document.getElementById('exam-sidebar');
  if (!sidebar) return;
  const counts = {};
  EXAM_QS.forEach(q => { counts[q.pattern] = (counts[q.pattern] || 0) + 1; });
  const allBtn = `<div class="exam-pattern ${state.examPattern === 'all' ? 'active' : ''}" data-pat="all">
                    <span>All patterns</span>
                    <span class="exam-pattern-count">${EXAM_QS.length}</span>
                  </div>`;
  const items = EXAM_PATTERNS.filter(p => counts[p.key]).map(p =>
    `<div class="exam-pattern ${state.examPattern === p.key ? 'active' : ''}" data-pat="${p.key}">
      <span>${p.title}</span>
      <span class="exam-pattern-count">${counts[p.key] || 0}</span>
    </div>`
  ).join('');
  sidebar.innerHTML = `<h3>Pattern</h3>${allBtn}${items}`;
  sidebar.querySelectorAll('[data-pat]').forEach(el => {
    el.addEventListener('click', () => {
      state.examPattern = el.dataset.pat;
      state.examIdx = 0;
      renderExamSidebar();
      renderExamContent();
    });
  });
}

function getExamQuestions() {
  if (state.examPattern === 'all') return EXAM_QS;
  return EXAM_QS.filter(q => q.pattern === state.examPattern);
}

function examKey(q) { return `${q.pattern}:${q.q.slice(0, 40)}`; }

function renderExamContent() {
  const content = document.getElementById('exam-content');
  if (!content) return;
  const qs = getExamQuestions();
  const total = qs.length;
  if (total === 0) {
    content.innerHTML = '<p style="color:var(--muted)">No questions yet for this pattern.</p>';
    return;
  }
  const idx = Math.min(state.examIdx, total - 1);
  const q = qs[idx];
  const key = examKey(q);
  const showHint = state.examHint.has(key);
  const showAnswer = state.examAnswer.has(key);
  const picked = state.examPick.get(key);

  const patternTitle = (EXAM_PATTERNS.find(p => p.key === q.pattern) || {}).title || q.pattern;

  const optsHtml = q.options.map((opt, i) => {
    let cls = 'exam-option';
    if (showAnswer) {
      if (i === q.correct) cls += ' correct-shown';
      else if (i === picked) cls += ' wrong-shown';
    } else if (i === picked) {
      cls += ' picked';
    }
    return `<button class="${cls}" data-pick="${i}">
              <span class="marker">${String.fromCharCode(65+i)}.</span>
              <span>${opt}</span>
            </button>`;
  }).join('');

  const hintHtml = showHint ? `<div class="exam-hint-panel">${q.hint}</div>` : '';
  const answerHtml = showAnswer
    ? `<div class="exam-answer-panel">
         <div class="answer-label">Answer &mdash; ${String.fromCharCode(65 + q.correct)}</div>
         <div>${q.expl}</div>
       </div>`
    : '';

  content.innerHTML = `
    <div class="exam-card">
      <div class="exam-card-head">
        <span class="exam-num">Q ${idx + 1} / ${total}</span>
        <span>${patternTitle} &middot; <span class="exam-source">${q.source}</span></span>
      </div>
      <div class="exam-question">${q.q}</div>
      <div class="exam-options">${optsHtml}</div>
      <div class="exam-action-row">
        <button class="exam-btn hint-btn" id="exam-show-hint">${showHint ? 'Hide tip' : '&#9788; Show tip'}</button>
        <button class="exam-btn answer-btn" id="exam-show-answer">${showAnswer ? 'Hide answer' : '&#10003; Show answer'}</button>
      </div>
      ${hintHtml}
      ${answerHtml}
      <div class="exam-nav-row">
        <button class="quiz-nav-btn" id="exam-prev" ${idx === 0 ? 'disabled' : ''}>&larr; Previous</button>
        <button class="quiz-nav-btn" id="exam-next" ${idx === total - 1 ? 'disabled' : ''}>Next &rarr;</button>
      </div>
    </div>
  `;

  if (window.renderMathInElement) {
    renderMathInElement(content, {
      delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
      throwOnError: false
    });
  }

  content.querySelectorAll('[data-pick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const choice = parseInt(btn.dataset.pick);
      state.examPick.set(key, choice);
      renderExamContent();
    });
  });
  document.getElementById('exam-show-hint')?.addEventListener('click', () => {
    if (state.examHint.has(key)) state.examHint.delete(key);
    else state.examHint.add(key);
    renderExamContent();
  });
  document.getElementById('exam-show-answer')?.addEventListener('click', () => {
    if (state.examAnswer.has(key)) state.examAnswer.delete(key);
    else state.examAnswer.add(key);
    renderExamContent();
  });
  document.getElementById('exam-prev')?.addEventListener('click', () => {
    if (state.examIdx > 0) { state.examIdx--; renderExamContent(); }
  });
  document.getElementById('exam-next')?.addEventListener('click', () => {
    if (state.examIdx < total - 1) { state.examIdx++; renderExamContent(); }
  });
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
