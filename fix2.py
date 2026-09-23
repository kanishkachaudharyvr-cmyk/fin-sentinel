import re

with open("components/fin-sentinel-dashboard.tsx", "r", encoding="utf-8") as f:
    c = f.read()

# Fix the JSX hardcodes
c = c.replace("{money(existingCommitment)}", "{money(profileCommitment)}")
c = c.replace("{safetyThreshold}%", "{profileThreshold}%")
c = c.replace("June 2026", "{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}")
c = c.replace("'June 2026'", "new Date().toLocaleString('default', { month: 'long', year: 'numeric' })")

# Now rewrite activeNav conditionally very carefully.
# Replace the top stage strip to use activeNav classes and set click handlers.
old_stage_strip = """<div className="stage-strip" aria-label="Financial workflow"><button className="stage complete" onClick={() => setActiveNav('Notifications')}><span>01</span><strong>RECONSTRUCT</strong><small>{notifications.length} signals found</small></button><button className="stage complete" onClick={() => setActiveNav('Repayment graph')}><span>02</span><strong>FORECAST</strong><small>{obligationCount} obligations linked</small></button><button className="stage active" onClick={() => document.querySelector('.simulator-panel')?.scrollIntoView({ behavior: 'smooth' })}><span>03</span><strong>SIMULATE</strong><small>Try before you borrow</small></button><button className="stage" onClick={() => document.querySelector('.forecast-panel')?.scrollIntoView({ behavior: 'smooth' })}><span>04</span><strong>PROTECT</strong><small>Threshold monitoring</small></button><button className="stage" onClick={() => setShowWhy(true)}><span>05</span><strong>EXPLAIN</strong><small>Plain-language insights</small></button></div>"""

new_stage_strip = """<div className="stage-strip" aria-label="Financial workflow">
            <button className={`stage ${activeNav === 'Notifications' ? 'active' : 'complete'}`} onClick={() => setActiveNav('Notifications')}><span>01</span><strong>RECONSTRUCT</strong><small>{notifications.length} signals found</small></button>
            <button className={`stage ${activeNav === 'Repayment graph' ? 'active' : 'complete'}`} onClick={() => setActiveNav('Repayment graph')}><span>02</span><strong>FORECAST</strong><small>{obligationCount} obligations linked</small></button>
            <button className={`stage ${activeNav === 'Simulator' ? 'active' : ''}`} onClick={() => setActiveNav('Simulator')}><span>03</span><strong>SIMULATE</strong><small>Try before you borrow</small></button>
            <button className={`stage ${activeNav === 'Overview' ? 'active' : ''}`} onClick={() => setActiveNav('Overview')}><span>04</span><strong>PROTECT</strong><small>Threshold monitoring</small></button>
          </div>"""

c = c.replace(old_stage_strip, new_stage_strip)

with open("components/fin-sentinel-dashboard.tsx", "w", encoding="utf-8") as f:
    f.write(c)
