import re

def html_to_jsx(html):
    jsx = html.replace('class=', 'className=')
    jsx = jsx.replace('for=', 'htmlFor=')
    for tag in ['img', 'input', 'br', 'hr', 'link', 'meta']:
        jsx = re.sub(r'<(%s\b[^>]*?)(?<!/)>' % tag, r'<\1 />', jsx)
    jsx = re.sub(r'<script.*?>.*?</script>', '', jsx, flags=re.DOTALL)
    return jsx

with open('scratch_ui/code.html', 'r', encoding='utf-8') as f:
    html = f.read()

jsx = html_to_jsx(html)

with open('scratch_ui/dashboard_new.jsx', 'w', encoding='utf-8') as f:
    f.write(jsx)
