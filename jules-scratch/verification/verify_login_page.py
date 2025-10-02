from playwright.sync_api import sync_playwright, expect
import time

def verify_login_page():
    """
    Verifies that the login page loads correctly, capturing console logs
    to debug client-side hydration issues.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # --- Listen for console messages ---
        # This will help us catch client-side JavaScript errors.
        page.on("console", lambda msg: print(f"BROWSER CONSOLE: [{msg.type}] {msg.text}"))

        try:
            # 1. Navigate to the root page
            print("Navigating to http://localhost:3000...")
            page.goto("http://localhost:3000")

            # 2. Wait for the "Login" heading to appear.
            print("Waiting for 'Login' heading...")
            login_heading = page.get_by_role("heading", name="Login")
            expect(login_heading).to_be_visible(timeout=10000)

            print("Login form is now visible.")

            # 3. Assert that the other form elements are also visible
            expect(page.get_by_label("Email")).to_be_visible()
            expect(page.get_by_label("Password")).to_be_visible()
            expect(page.get_by_role("button", name="Sign in")).to_be_visible()

            print("All login form elements are visible.")

            # 4. Take a screenshot for visual confirmation
            screenshot_path = "jules-scratch/verification/login_page.png"
            page.screenshot(path=screenshot_path)
            print(f"Screenshot saved to {screenshot_path}")

        except Exception as e:
            print(f"\n--- An error occurred during verification ---")
            print(f"ERROR: {e}")
            print("--------------------------------------------")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_login_page()