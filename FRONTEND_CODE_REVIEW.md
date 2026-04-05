# FashionStore Frontend — Full Code Review & Audit Report
> **Reviewed on:** 2026-04-04  
> **Scope:** Read-only analysis. No source files were modified.  
> **Total files reviewed:** 27 source files across `/src/app`, `/src/components`, `/src/context`, `/src/middleware.ts`

---

## 1. Unused Code Found

### 1.1 — `mounted` variable always `true` in Navbar
**File:** `src/components/Navbar.tsx` — **Line 45**

```ts
const mounted = true; // AuthContext handles async loading
```

**What it does:** Originally this was a state variable (`useState(false)`) used to prevent hydration mismatches by hiding auth-dependent UI until the component was mounted client-side.

**Why it is unnecessary:** It has been replaced with the value `true` (a hardcoded constant), so the original purpose is gone. Every conditional that checks `if (mounted)` or `{mounted && ...}` (lines 188, 227, 335, 379, 386, 389) is just `{true && ...}`, making `mounted` a no-op.

**Fix:** Remove the `mounted` variable and all `mounted &&` guards. They add visual noise and confusion without providing any protection. AuthContext's `loading` state already handles async initialization.

**Lines affected:** 45, 188, 227, 335, 379, 386, 389

---

### 1.2 — `stripePaymentId` state never read
**File:** `src/app/checkout/page.tsx` — **Line 35**

```ts
const [stripePaymentId, setStripePaymentId] = useState('');
```

**What it does:** Intended to hold the Stripe Payment Intent ID after a successful card payment.

**Why it is unnecessary:** `setStripePaymentId(paymentIntentId)` is called on line 135 inside `handleStripeSuccess`, but `stripePaymentId` is never read anywhere in the component. The actual `paymentIntentId` is passed directly to `orderData.stripePaymentId`, so the state variable serves no purpose.

**Fix:** Remove the `stripePaymentId` state and the `setStripePaymentId(paymentIntentId)` call. The local function parameter is sufficient.

---

### 1.3 — `Chatbot.tsx` component is entirely unused
**File:** `src/components/Chatbot.tsx` (417 lines)

**What it does:** A fully-featured floating chatbot widget with a knowledge base, quick chips, typing indicator, and mobile-redirect logic.

**Why it is unnecessary:** The chatbot is **never imported or rendered anywhere** in the application. The root layout (`layout.tsx`) loads the Botpress external chatbot via two `<Script>` tags instead. The internal `Chatbot.tsx` component is a dead artifact — it was replaced by Botpress but never deleted.

**Note:** The mobile redirect inside `Chatbot.tsx` → `/chat` route references a page that also exists (`/src/app/chat/`), but since `Chatbot.tsx` is never mounted, the `/chat` route is only reachable by direct URL — it may be dead UI as well.

**Fix:** Safely audit whether `/src/app/chat/` is still needed. If not, both `Chatbot.tsx` and the `chat/` route can be deleted. `chatbot.css` would also no longer be needed.

---

### 1.4 — `router` imported but unused in `OrderListContent`
**File:** `src/app/orders/page.tsx` — **Line 471**

```ts
const router = useRouter();
```

**What it does:** Imports the Next.js router.

**Why it could be unused:** `router` appears only used implicitly in the `useEffect` dependency array at line 512 (`[searchParams, router]`). However, `router` is never actually called inside that effect — only `searchParams` is used to check `?success=true`. The redirect to login on 401 (line 521) uses `router.push`, so it IS used. This is fine — no removal needed. But the dependency array could remove `router` since routers are stable refs.

**Verdict:** Minor — not a real bug, but the dependency `[searchParams, router]` should really be `[searchParams]`.

---

### 1.5 — `lib/` directory is completely empty
**File:** `src/lib/` — **0 files**

**Why it is unnecessary:** The directory exists but contains nothing. It adds noise to the project structure.

**Fix:** Safe to delete the empty `lib/` directory.

---

### 1.6 — Dead nav links pointing to generic `/search`
**File:** `src/components/Navbar.tsx` — **Lines 291–292, 401–403**

```tsx
<li><Link href="/search">New Arrivals</Link></li>
<li><Link href="/search">Sale</Link></li>
```

```tsx
<Link href="/search" onClick={closeMobileMenu}>New Arrivals</Link>
<Link href="/search" onClick={closeMobileMenu}>Sale & Deals</Link>
```

**What they do:** Both "New Arrivals" and "Sale/Deals" links point to the general `/search` page without any query parameters, so they land on an empty search with no context.

**Why it is a concern:** Users clicking "Sale" or "New Arrivals" get the same unfiltered search page, which is confusing. These links are functionally identical to each other and to clicking the search bar.

**Fix:** Either add meaningful query params (e.g., `?filter=sale`, `?sort=newest`) or update the routes to proper category pages once those features exist.

---

## 2. Redundant Logic

### 2.1 — Duplicate `getImageUrl` helper in multiple files
**What is duplicated:**
```ts
const BACKEND = 'http://localhost:5000';
function getImageUrl(img: string | undefined): string {
    if (!img) return 'https://via.placeholder.com/...';
    if (img.startsWith('http')) return img;
    return `${BACKEND}${img}`;
}
```

**Where it exists:**
- `src/app/orders/page.tsx` — Lines 18–23
- `src/app/checkout/page.tsx` — Lines 11–16

**Why it is redundant:** Both files copy-paste the exact same logic (with only slightly different placeholder sizes).

**Recommended single source of truth:** Create a shared utility file, e.g., `src/lib/imageUrl.ts`:
```ts
const BACKEND = 'http://localhost:5000';
export function getImageUrl(img?: string, fallbackSize = '80x80'): string {
    if (!img) return `https://via.placeholder.com/${fallbackSize}/f3f3f3/333?text=No+Image`;
    if (img.startsWith('http')) return img;
    return `${BACKEND}${img}`;
}
```
Then import it in both files.

---

### 2.2 — Hardcoded backend URL `http://localhost:5000` scattered everywhere
**What is duplicated:** The string `'http://localhost:5000'` appears in nearly every file that makes API calls.

**Where it exists:**
- `src/context/AuthContext.tsx` — Line 23 (`const API = 'http://localhost:5000'`)
- `src/context/CartContext.tsx` — Lines 39, 112, 151, 168, 198 (inline)
- `src/app/admin/login/page.tsx` — Line 7 (`const API = 'http://localhost:5000'`)
- `src/app/admin/dashboard/page.tsx` — Line 33 (inline)
- `src/app/admin/products/page.tsx` — Lines 67, 84, 102, 103 (inline)
- `src/app/admin/orders/page.tsx` — Line 34, 70 (inline)
- `src/app/admin/coupons/page.tsx` — Lines 36, 60, 61, 81, 98 (inline)
- `src/app/admin/users/page.tsx` — Lines 37, 70, 95 (inline)
- `src/app/checkout/page.tsx` — Lines 11, 51, 116, 160 (inline + BACKEND var)
- `src/app/orders/page.tsx` — Lines 18, 489, 518 (inline + BACKEND var)
- `src/app/login/page.tsx` — Line 39 (inline)
- `src/app/register/page.tsx` — Line 203 (inline)
- `src/components/WishlistButton.tsx` — Lines 18, 34 (inline)

**Why it is a problem:** In production, the backend URL changes. Updating 15+ places manually is error-prone and violates the DRY principle.

**Recommended fix:** Store in `.env.local` (already exists) and reference via `process.env.NEXT_PUBLIC_API_URL`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Then use `process.env.NEXT_PUBLIC_API_URL` everywhere, or define a single `src/lib/api.ts` constant.

---

### 2.3 — `STATUS_COLORS` constant is duplicated
**What is duplicated:**
```ts
const STATUS_COLORS: Record<string, string> = {
    Pending: '#f0a500',
    Confirmed: '#1a6ef5',
    Shipped: '#7b2ff7',
    Delivered: '#1e8c45',
    Cancelled: '#d00',
};
```

**Where it exists:**
- `src/app/admin/dashboard/page.tsx` — Lines 17–23
- `src/app/admin/orders/page.tsx` — Lines 10–16

**Recommended fix:** Move to a shared constants file, e.g., `src/lib/orderConstants.ts`, and import in both admin pages.

---

### 2.4 — Duplicate cart-item mapping logic (map + filter pattern)
**What is duplicated:** The pattern of filtering `bi.product != null` then mapping backend cart items to `CartItem[]` appears verbatim in three places:

**Where it exists:**
- `src/context/CartContext.tsx` — Lines 44–55 (initial cart sync)
- `src/context/CartContext.tsx` — Lines 126–137 (after addToCart)
- `src/context/CartContext.tsx` — Lines 176–188 (after updateQuantity)

**Recommended fix:** Extract to a private helper inside `CartContext.tsx`:
```ts
const mapBackendItems = (items: any[]): CartItem[] =>
    (items || [])
        .filter((i) => i.product != null)
        .map((i) => ({
            id: i.product._id,
            _itemId: i._id,
            name: i.product.name,
            price: i.price,
            image: i.product.images?.[0] || '',
            quantity: i.quantity,
            size: i.size || '',
            color: i.color || '',
        }));
```

---

### 2.5 — Admin guard applied redundantly in `AdminGuard` + `/admin/page.tsx`
**What is duplicated:** Both `AdminGuard.tsx` (lines 11–17) and `/admin/page.tsx` (lines 17–24) contain a `useEffect` that reads `user` and `loading` and performs a redirect. These are different pages (the redirect page vs. the guard wrapper), but the logic is similar and the admin pages wrapping `<AdminGuard>` also redundantly duplicate the check.

**Verdict:** The two are fulfilling different purposes (`/admin` is a redirect landing; `AdminGuard` is a gate for child pages), so this is acceptable. However, `AdminGuard` checks `!user` → `/admin/login` AND `user.role !== 'admin'` → `/`. The `/admin` page checks `user.role === 'admin'` → `/admin/dashboard`, else `/`. These are complementary, not redundant.

**Verdict: Low priority** — current separation is intentional.

---

### 2.6 — `getBuyAgainProducts()` is called twice in Orders page JSX
**File:** `src/app/orders/page.tsx` — Lines 590, 597

```tsx
{getBuyAgainProducts().length === 0 ? (
    ...
) : (
    getBuyAgainProducts().map(...)
)}
```

**Why it is redundant:** `getBuyAgainProducts()` iterates over all orders and builds a Map on every call. It is called twice when the "Buy Again" tab is active — once to check length and once to render.

**Fix:** Call it once and store the result:
```tsx
const buyAgainProducts = getBuyAgainProducts();
{buyAgainProducts.length === 0 ? ... : buyAgainProducts.map(...)}
```

---

### 2.7 — `getFilteredOrders()` called twice in Orders page JSX
**File:** `src/app/orders/page.tsx` — Lines 617, 627

```tsx
getFilteredOrders().length === 0 ? (...) : (getFilteredOrders().map(...))
```

**Same issue as 2.6** — double computation on each render.

**Fix:** Extract to a local variable before the JSX:
```tsx
const filteredOrders = getFilteredOrders();
```

---

## 3. Security Issues

### 3.1 — `localStorage.removeItem('token')` called during product save error
**Risk Level:** 🟡 Medium  
**File:** `src/app/admin/products/page.tsx` — **Line 128**

```ts
localStorage.removeItem('token');
document.cookie = 'admin_session=; path=/; max-age=0; SameSite=Strict';
window.location.href = '/login'; // ← redirects to USER login, not admin
```

**What it does:** When a product save fails with an authorization error, this code clears a legacy `localStorage` token (which no longer exists after the cookie-auth migration) and redirects to `/login` (the user login page), not `/admin/login`.

**Why it is a risk:**
1. `localStorage.removeItem('token')` is a leftover from the old token-based auth. The current system uses HTTP-only cookies. This code has no effect but signals incomplete migration.
2. **Redirect goes to `/login` (user login), not `/admin/login`**. An admin whose session expires will be sent to the wrong login page and may become confused.
3. The `admin_session` cookie is cleared client-side, but the server's `auth_token` HTTP-only cookie is NOT cleared (no logout API call), leaving an inconsistent auth state.

**Fix:**
```ts
// Replace the entire catch block error handling:
window.location.href = '/admin/login'; // Correct page
// Remove localStorage.removeItem('token') entirely
// Optionally call the logout API: fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
```

---

### 3.2 — `console.error` logs in production (data exposure)
**Risk Level:** 🟢 Low  
**Files:**
- `src/context/CartContext.tsx` — Lines 61, 141, 157, 191, 203
- `src/app/page.tsx` — Line 323

**What they do:** Log errors to the browser console.

**Why it is a concern:** `console.error` messages in production can expose internal server error messages, API structure hints, or stack traces to end users who open DevTools. While not critical for a non-sensitive e-commerce frontend, it is not best practice.

**Fix:** Use a conditional logger:
```ts
if (process.env.NODE_ENV !== 'production') {
    console.error(err);
}
```
Or use a proper logging library that silences in production.

---

### 3.3 — `dangerouslySetInnerHTML` in Chatbot messages
**Risk Level:** 🟡 Medium (mitigated by context)  
**File:** `src/components/Chatbot.tsx` — **Line 348**

```tsx
dangerouslySetInnerHTML={{
    __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}}
```

**What it does:** Converts bot message text to HTML including bold formatting and line breaks.

**Why it is a concern:** Bot messages come from the hardcoded `knowledgeBase` array and `FALLBACK_ANSWER` — not from user input. However, the pattern of `dangerouslySetInnerHTML` is flagged because:
1. If the chatbot system is ever extended to pull answers from a backend/database, this pattern becomes an XSS vector.
2. The links in knowledge base answers (e.g., `<a href="/orders">`) are rendered as actual HTML through this — which is the intent, but it bypasses React's XSS protections.

**Fix:** Since `Chatbot.tsx` is currently unused (see Issue 1.3), this is moot. If reinstated, use a safe markdown renderer (e.g., `react-markdown`) instead.

---

### 3.4 — Admin `SupportModal` and `FeedbackModal` are fake (no backend)
**Risk Level:** 🟡 Medium  
**File:** `src/app/orders/page.tsx` — Lines 214–265 (SupportModal), Lines 268–326 (FeedbackModal)

**What they do:** These modals collect user support requests and seller feedback but only call `setSubmitted(true)` on submission — **they never send any data to the backend**.

**Why it is a concern:** Users believe they have submitted a support ticket or feedback, but nothing is stored. The UI tells them "Our support team will contact you within 24 hours. Reference: SUP-XXXXXX" — a false confirmation that could lead to customer trust issues.

**Fix:** Either:
1. Wire these forms to actual backend endpoints (e.g., `POST /api/support` and `POST /api/reviews`), OR
2. Clearly label them as "Coming Soon" / remove them until implemented.

---

### 3.5 — Admin login CAPTCHA is a fake checkbox (bypassable)
**Risk Level:** 🟡 Medium  
**File:** `src/app/admin/login/page.tsx` — Lines 212–233

```tsx
<input
    type="checkbox"
    id="captcha"
    checked={captchaChecked}
    onChange={e => setCaptchaChecked(e.target.checked)}
/>
<label htmlFor="captcha">I am not a robot</label>
```

**What it does:** Renders a "not a robot" checkbox for the admin login page.

**Why it is a risk:** This is a purely frontend validation (`if (!captchaChecked) return;`). It provides **zero protection** against bots or automated login attacks. Any script can simply skip the frontend or programmatically check the box. The server handles rate limiting (429 responses) via backend middleware, but the fake CAPTCHA adds false confidence that there's bot protection.

**Fix:** Either replace with real reCAPTCHA v3 (invisible, recommended for admin login) or remove the checkbox entirely and rely solely on the backend rate limiting. Keeping it as-is creates UI complexity with zero security benefit.

---

### 3.6 — Personal contact information hardcoded in Chatbot knowledge base
**Risk Level:** 🟢 Low  
**File:** `src/components/Chatbot.tsx` — **Line 144**

```ts
answer: '...📧 **Email**: <a href="mailto:huraira3076@gmail.com">huraira3076@gmail.com</a>\n📞 **Phone**: <a href="tel:+923326871681">+92 332 6871681</a>...'
```

**What it does:** Exposes a personal email and phone number as the "customer support" contact in the chatbot. These appear to be the developer's personal details.

**Why it is a concern:** Shipping a production app with personal contact details is not professional or secure. These details are indexed and visible to anyone visiting the site.

**Fix:** Replace with a dedicated business email and phone number, or a support form URL. (Since `Chatbot.tsx` is currently unused, this is lower urgency but still important before any re-deployment.)

---

## 4. Performance Improvements

### 4.1 — Home page fetches ALL products at once with no server-side filtering
**File:** `src/app/page.tsx` — **Lines 314–329**

```ts
const res = await fetch('http://localhost:5000/api/products');
```

**Issue:** The home page fetches the entire product catalog (potentially hundreds of products) in a single client-side request, then filters locally. This means:
- Slow initial load for large catalogs
- All product data crosses the wire even if only 8 products per section are shown
- No server-side pagination

**Fix:** Use server-side filtered endpoints per section:
- `GET /api/products?category=men&sub=tops&limit=8`
- Or use React Server Components with parallel `await fetch()` calls
- At minimum, add `?limit=96` or a reasonable cap to the current single query

---

### 4.2 — `WishlistButton` makes an individual API call per product card on page load
**File:** `src/components/WishlistButton.tsx` — **Lines 17–26**

```ts
useEffect(() => {
    fetch('http://localhost:5000/api/wishlist', { credentials: 'include' })
        .then(r => r.ok ? r.json() : [])
        .then(...)
}, [productId]);
```

**Issue:** Every `WishlistButton` component mounts and immediately calls `GET /api/wishlist`. On the home page with 8+ product cards per section and 12 sections, this results in dozens of simultaneous identical API calls.

**Fix:** Lift wishlist state into a `WishlistContext` (similar to `CartContext`) that fetches once and provides the list to all buttons. Each button checks `wishlistIds.includes(productId)` from context instead of making its own request.

---

### 4.3 — Admin products page never uses the `state` field from checkout
**File:** `src/app/checkout/page.tsx` — **Lines 94–113**

```ts
const orderData = {
    orderItems: cartItems.map(item => ({
        size: 'M',           // ← Hardcoded!
        color: 'Default',    // ← Hardcoded!
        ...
    })),
    shippingAddress: {
        address: shippingAddress.address,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country
        // ← 'state' and 'fullName' and 'phone' are missing from the sent address!
    },
```

**Issue 1:** `size` and `color` are hardcoded to `'M'` and `'Default'` in the order submission, ignoring the actual `item.size` and `item.color` from the cart item. This means orders never reflect the user's chosen size/color.

**Issue 2:** `shippingAddress.fullName`, `shippingAddress.state`, and `shippingAddress.phone` are collected in the form but **never included in the submitted order data**. This data is lost.

**Fix:** Use `item.size` and `item.color` from the cart, and include `fullName`, `state`, and `phone` in the `shippingAddress` object sent to the backend.

---

### 4.4 — `page.tsx` (home) component has no lazy loading for below-the-fold sections
**File:** `src/app/page.tsx` — **Lines 372–400**

**Issue:** All 12 product sections (Men's, Women's, Kids' — each with 4 sub-sections) are rendered immediately on mount. This causes 12 list renders with skeleton loading states simultaneously, even for sections far below the fold.

**Fix:** Use `IntersectionObserver` or Next.js `dynamic()` to defer rendering of below-the-fold sections until they scroll into view.

---

### 4.5 — No loading/auth guard on checkout page — relies solely on cart being empty
**File:** `src/app/checkout/page.tsx` — **Lines 77–82, 179**

```ts
useEffect(() => {
    if (!isLoaded) return;
    if (cartCount === 0 && !loading) {
        router.push('/cart');
    }
}, [cartCount, router, isLoaded, loading]);

if (!isLoaded || cartCount === 0) return null;
```

**Issue:** The checkout page only redirects unauthenticated users if the cart is empty (which it would be for a logged-out user since cart is fetched server-side). But there's a brief flash where `isLoaded = false` and the page renders `null`. More importantly, there is **no explicit auth check** on the checkout page — if an unauthenticated user somehow has items (e.g., from a stale in-memory state), they could attempt checkout.

**Fix:** Add an explicit auth guard using `useAuth()`:
```ts
const { user, loading: authLoading } = useAuth();
useEffect(() => {
    if (!authLoading && !user) {
        router.push('/login?redirect=/checkout');
    }
}, [user, authLoading, router]);
```

---

## 5. Code Structure & Readability

### 5.1 — Admin pages use raw `<a>` tags instead of Next.js `<Link>`
**Files:**  
- `src/app/admin/dashboard/page.tsx` — Lines 94, 148  
- `src/components/AdminSidebar.tsx` — Line 51

These pages use `<a href="...">` for internal navigation instead of Next.js `<Link>`. This causes full page reloads rather than client-side navigation, degrading the admin panel performance.

**Fix:** Replace `<a href="/admin/...">` with `<Link href="/admin/...">` from `next/link`.

---

### 5.2 — `AdminGuard` renders `null` causing content flash
**File:** `src/components/AdminGuard.tsx` — **Line 30**

```ts
if (!user || user.role !== 'admin') return null;
```

**Issue:** After the loading spinner disappears, the component immediately returns `null` while the redirect is still happening (async router push). There's a brief flash where the page renders nothing before navigating.

**Recommendation:** Replace `return null` with the loading spinner itself, so the spinner persists until the redirect completes:
```ts
if (!user || user.role !== 'admin') {
    return <LoadingSpinner />;
}
```

---

### 5.3 — Admin coupons and users pages use `<> ... </>` fragment wrapping both `AdminGuard` and `DeleteConfirmModal` at the wrong level
**Files:**  
- `src/app/admin/coupons/page.tsx` — Lines 112–245  
- `src/app/admin/users/page.tsx` — Lines 113–241

Both pages have this structure:
```tsx
<>
  <AdminGuard>
    ... (admin content) ...
  </AdminGuard>
  <DeleteConfirmModal ... />
</>
```

**Issue:** `DeleteConfirmModal` is rendered **outside** `<AdminGuard>`. This means the modal is rendered in the DOM even before the auth check passes. While the modal is controlled by state (it's hidden by default), it should ideally be inside the guard.

**Fix:** Move `<DeleteConfirmModal>` inside `<AdminGuard>`:
```tsx
<AdminGuard>
    <div className="admin-container">
        ...
    </div>
    <DeleteConfirmModal ... />
</AdminGuard>
```

---

### 5.4 — `any` type used extensively in admin pages
**Files:** All admin pages (`dashboard`, `products`, `orders`, `coupons`, `users`) use `any[]` for orders, products, and other data types.

**Issue:** Using `any` defeats TypeScript's purpose. Type errors can occur silently (e.g., `order.user?.name`, `product.images[0]`).

**Recommendation:** Define proper interfaces for the core data models (Order, Product, User) in a shared `src/types/` directory and use them consistently.

---

### 5.5 — `admin/page.css` imported in EVERY admin page
**Files:**  
- `src/app/admin/dashboard/page.tsx` — Line 4 (`import '../page.css'`)
- `src/app/admin/orders/page.tsx` — Line 4 (`import '../page.css'`)
- `src/app/admin/coupons/page.tsx` — Line 4 (`import '../page.css'`)
- `src/app/admin/users/page.tsx` — Line 4 (`import '../page.css'`)
- `src/app/admin/products/page.tsx` — Line 8 (`import '../page.css'`)

**Issue:** Next.js deduplicates CSS imports, so this is not technically a bug, but it's semantically wrong. `page.css` is an admin-wide stylesheet and should be imported once — ideally in an admin layout (`src/app/admin/layout.tsx`) that doesn't exist yet.

**Fix:** Create `src/app/admin/layout.tsx` and import `page.css` there once, removing it from all individual admin pages.

---

## 6. Final Cleanup Summary

| Metric | Count |
|---|---|
| **Total source files reviewed** | 27 |
| **Files with issues found** | 18 |
| **Files safe to delete** | 2 (potentially: `Chatbot.tsx`, `chatbot.css`, `src/lib/` empty dir) |
| **Files needing code changes** | 16 |
| **Critical / High security issues** | 0 |
| **Medium security issues** | 4 |
| **Low security issues** | 2 |
| **Performance issues** | 5 |
| **Unused code items** | 6 |
| **Redundant/duplicate logic items** | 7 |

---

## Summary by Priority

### 🔴 Fix Immediately (Functional Bugs)
1. **Checkout hardcodes `size: 'M'` and `color: 'Default'`** — orders lose user selections
2. **`fullName`, `state`, `phone` missing from checkout order submission** — lost data
3. **Admin product session-expiry redirects to `/login` instead of `/admin/login`**

### 🟡 Fix Soon (Security & UX)
4. **Fake CAPTCHA on admin login** — replace with real reCAPTCHA or remove
5. **SupportModal and FeedbackModal don't save data** — false confirmation to users
6. **`dangerouslySetInnerHTML` in Chatbot** — XSS risk if chatbot is re-enabled
7. **`DeleteConfirmModal` outside `AdminGuard`** — renders outside auth gate

### 🟢 Clean Up (Developer Experience)
8. **Extract `getImageUrl` to `src/lib/imageUrl.ts`**
9. **Extract `STATUS_COLORS` to `src/lib/orderConstants.ts`**
10. **Extract `mapBackendItems` helper inside CartContext**
11. **Move backend URL to `NEXT_PUBLIC_API_URL` env var**
12. **Create `src/app/admin/layout.tsx`** to deduplicate CSS imports
13. **Remove unused `mounted = true`** constant in Navbar
14. **Remove unused `stripePaymentId` state** in Checkout
15. **Audit and remove `Chatbot.tsx` + `chatbot.css`** if Botpress is permanent
16. **Replace `<a>` with `<Link>` in admin pages**
17. **Cache `getFilteredOrders()` and `getBuyAgainProducts()`** in Orders page
18. **Add `WishlistContext`** to batch wishlist fetches

---

*This report was generated from a read-only analysis. No source files were modified.*
