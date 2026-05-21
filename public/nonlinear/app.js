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
