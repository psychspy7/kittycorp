# Security Policy

Kitty Corp prioritizes the security of our platforms, customer payments, infrastructure, and user data.

## Supported Versions

Only the current primary branch and active production release are maintained for security updates:

| Branch / Environment | Supported | Security Policy |
| :--- | :---: | :--- |
| `main` (Production) | Yes | Active vulnerability patches and rapid remediation |
| Historical / Staging | No | Not supported for standalone patches |

---

## Reporting a Vulnerability

If you identify a security vulnerability, sensitive data exposure, or authentication defect:

1. **Do not create a public GitHub issue, discussion thread, or pull request.**
2. Send an encrypted or detailed report directly to:
   **kittycorp.info@gmail.com**
3. Please include in your report:
   - Affected endpoint, route, or source file.
   - Severity assessment and practical impact description.
   - Step-by-step reproduction guide or minimal proof-of-concept.
   - Any mitigation or workaround you have identified.

### Response Commitment

- **Acknowledgment:** Within 48 hours of initial transmission.
- **Assessment & Triage:** Within 5 business days for verified findings.
- **Patch Deployment:** Deployed to production immediately upon validation through our automated test suites.
- **Coordinated Disclosure:** We request that researchers withhold public disclosure until a patch is live in production.
