import re

with open("components/fin-sentinel-dashboard.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix hardcoded dates and texts
content = content.replace("June 2026", "{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}")
content = content.replace("'June 2026'", "new Date().toLocaleString('default', { month: 'long', year: 'numeric' })")
content = content.replace("12 Jun", "Upcoming")
content = content.replace("1 Jun", "Start")
content = content.replace("24 Jun", "Peak")
content = content.replace("30 Jun", "End")

# Implement Tab Navigation
# We need to find where the content starts and wrap them in conditionally rendered blocks based on `activeNav`.

content = content.replace("""          <div className="stage-strip" aria-label="Financial workflow"><button className="stage complete" onClick={() => setActiveNav('Notifications')}><span>01</span><strong>RECONSTRUCT</strong><small>{notifications.length} signals found</small></button><button className="stage complete" onClick={() => setActiveNav('Repayment graph')}><span>02</span><strong>FORECAST</strong><small>{obligationCount} obligations linked</small></button><button className="stage active" onClick={() => document.querySelector('.simulator-panel')?.scrollIntoView({ behavior: 'smooth' })}><span>03</span><strong>SIMULATE</strong><small>Try before you borrow</small></button><button className="stage" onClick={() => document.querySelector('.forecast-panel')?.scrollIntoView({ behavior: 'smooth' })}><span>04</span><strong>PROTECT</strong><small>Threshold monitoring</small></button><button className="stage" onClick={() => setShowWhy(true)}><span>05</span><strong>EXPLAIN</strong><small>Plain-language insights</small></button></div>""",
"""          <div className="stage-strip" aria-label="Financial workflow">
            <button className={`stage ${activeNav === 'Notifications' ? 'active' : 'complete'}`} onClick={() => setActiveNav('Notifications')}><span>01</span><strong>RECONSTRUCT</strong><small>{notifications.length} signals found</small></button>
            <button className={`stage ${activeNav === 'Repayment graph' ? 'active' : 'complete'}`} onClick={() => setActiveNav('Repayment graph')}><span>02</span><strong>FORECAST</strong><small>{obligationCount} obligations linked</small></button>
            <button className={`stage ${activeNav === 'Simulator' ? 'active' : ''}`} onClick={() => setActiveNav('Simulator')}><span>03</span><strong>SIMULATE</strong><small>Try before you borrow</small></button>
            <button className={`stage ${activeNav === 'Overview' ? 'active' : ''}`} onClick={() => setActiveNav('Overview')}><span>04</span><strong>PROTECT</strong><small>Threshold monitoring</small></button>
          </div>
""")

# We wrap overview things in {activeNav === 'Overview' && ( ... )}
content = content.replace("""          <div className={`device-sync-card""", """          {activeNav === 'Overview' && (<>\n            <div className={`device-sync-card""")

content = content.replace("""          <div className="dashboard-grid">""", """          </>)}\n          {activeNav === 'Overview' && (\n          <div className="dashboard-grid">""")

# Wrap device records in {activeNav === 'Notifications' && ...}
content = content.replace("""          {deviceRecords.length > 0 && <section className="panel device-records-panel">""", """          </>)}\n\n          {activeNav === 'Notifications' && (\n            <>\n              {deviceRecords.length > 0 ? <section className="panel device-records-panel">""")
content = content.replace("""          {!deviceRecords.length && <div className="device-empty-state">""", """              : <div className="device-empty-state">""")
content = content.replace("""FIN SENTINEL will automatically add eligible EMI records when your connected device sends notification data.</p></div></div>}""", """FIN SENTINEL will automatically add eligible EMI records when your connected device sends notification data.</p></div></div>}\n            </>\n          )}""")

# Wrap repayment graph in {activeNav === 'Repayment graph' && ...}
content = content.replace("""            <section className="panel forecast-panel">""", """          {activeNav === 'Repayment graph' && (\n            <section className="panel forecast-panel">""")
content = content.replace("""cluster in 12 days</strong><p>₹6,500 is due between Upcoming–Peak. Keep a buffer available.</p></div></div></section></div>""", """cluster in 12 days</strong><p>₹6,500 is due between Upcoming–Peak. Keep a buffer available.</p></div></div></section>\n          )}</div>""")

# Wrap Simulator in {activeNav === 'Simulator' && ...}
content = content.replace("""          <div className="lower-grid"><section className="panel simulator-panel">""", """          <div className="lower-grid">\n          {activeNav === 'Simulator' && (\n            <section className="panel simulator-panel">""")
content = content.replace("""Review the impact before proceeding.</p></div>}</div>}</div></section>""", """Review the impact before proceeding.</p></div>}</div>}</div></section>\n          )}""")

with open("components/fin-sentinel-dashboard.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Rewrite successful")
