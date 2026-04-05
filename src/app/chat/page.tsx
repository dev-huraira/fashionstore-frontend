'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../components/chatbot.css';
import './chat-page.css';

/* ─── Knowledge Base (same as widget) ─── */
type KBEntry = { keywords: string[]; answer: string };

const knowledgeBase: KBEntry[] = [
    { keywords: ['shipping', 'delivery', 'deliver', 'ship', 'how long', 'when arrive', 'arrive', 'dispatch'], answer: 'We offer multiple shipping options:\n\n🚚 **Next-Day Delivery** — FREE on all orders (order before 3 PM)\n📦 **Standard** — FREE over $25, $2.99 below\n⚡ **Express Same-Day** — $4.99 (metro areas, before 12 PM)\n🌍 **International** — 7–14 days, calculated at checkout\n\nVisit our <a href="/shipping">Shipping page</a> for full details.' },
    { keywords: ['free shipping', 'shipping cost', 'shipping fee', 'shipping charge', 'shipping price'], answer: 'Great news! **Next-Day Delivery is FREE** on all orders. Standard shipping is also free on orders over $25. Check our <a href="/shipping">Shipping page</a> for all options.' },
    { keywords: ['international', 'worldwide', 'overseas', 'abroad', 'country', 'countries'], answer: 'Yes! We ship to **40+ countries** worldwide. International delivery takes 7–14 business days. Duties and taxes are calculated at checkout. See our <a href="/shipping">Shipping page</a> for details.' },
    { keywords: ['track', 'tracking', 'where is my order', 'order status', 'track order', 'find order'], answer: 'You can track your order from the <a href="/orders">Your Orders</a> page. Once dispatched, you\'ll also receive an email with a tracking link.' },
    { keywords: ['return', 'refund', 'money back', 'send back', 'return policy'], answer: 'We offer a hassle-free **30-day return policy** on all items:\n\n1. Go to <a href="/orders">Your Orders</a>\n2. Select the item → "Return or Replace"\n3. We\'ll email a free prepaid label\n4. Refund processed in **5–7 business days**\n\nVisit our <a href="/returns">Returns page</a> for full details.' },
    { keywords: ['exchange', 'replace', 'replacement', 'wrong item', 'different size', 'swap'], answer: 'Need a different size or color? Select **"Replace"** instead of "Return" from your <a href="/orders">Orders page</a>. We\'ll ship the replacement for free!' },
    { keywords: ['refund method', 'refund how', 'refund time', 'when refund', 'get money back'], answer: 'Refunds are processed within **5–7 business days** after we receive your return.\n\n💳 Original payment method (default)\n🏷️ FashionStore credit (instant)\n🏦 Bank transfer (3–5 days)' },
    { keywords: ['payment', 'pay', 'payment method', 'how to pay', 'accepted payments'], answer: 'We accept:\n\n💵 **Cash on Delivery (COD)** — Pay when you receive\n💳 **Credit/Debit Card** — Visa, Mastercard, AMEX via Stripe\n\nAll card payments are **encrypted and secure** 🔒' },
    { keywords: ['cod', 'cash on delivery', 'cash'], answer: 'Yes! We accept **Cash on Delivery (COD)**. Simply select COD at checkout and pay when your order arrives. No extra fees!' },
    { keywords: ['card', 'credit card', 'debit card', 'stripe', 'visa', 'mastercard'], answer: 'We accept **Visa, Mastercard, and AMEX** via Stripe secure payment. Your card info is fully encrypted 🔒.' },
    { keywords: ['secure', 'safe', 'security', 'encrypted', 'trust', 'scam'], answer: 'Your security is our top priority! All card payments are processed through **Stripe**, a PCI-compliant payment processor. **Encrypted end-to-end** 🔒.' },
    { keywords: ['account', 'sign up', 'register', 'create account', 'new account'], answer: 'Creating an account is easy! Click <a href="/register">Sign Up</a>, enter your name, email, and password — you\'re all set! With an account you can track orders, save to wishlist, and checkout faster.' },
    { keywords: ['login', 'sign in', 'log in', 'cant login', 'forgot password', 'password'], answer: 'To sign in, click <a href="/login">Sign In</a> and enter your email and password. Having trouble? Try resetting your password from the login page.' },
    { keywords: ['profile', 'edit profile', 'change name', 'change email', 'my account', 'account settings'], answer: 'You can manage your profile from the <a href="/profile">Your Account</a> page. Update your name, email, and other account details there.' },
    { keywords: ['what do you sell', 'products', 'category', 'categories', 'what you have', 'collection'], answer: 'FashionStore has a wide collection across **three main categories**:\n\n👔 <a href="/category/men">Men</a> — Tops, Bottoms, Activewear, Shoes\n👗 <a href="/category/women">Women</a> — Tops, Bottoms, Activewear, Shoes\n👶 <a href="/category/kids">Kids</a> — Tops, Bottoms, Activewear, Shoes\n\nCheck out our <a href="/best-sellers">Best Sellers</a> too!' },
    { keywords: ['men', 'mens', "men's", 'male', 'guys'], answer: 'Browse our <a href="/category/men">Men\'s Collection</a>! We have Tops & Tees, Bottoms, Activewear, and Shoes.' },
    { keywords: ['women', 'womens', "women's", 'female', 'ladies'], answer: 'Explore our <a href="/category/women">Women\'s Collection</a>! Tops & Tees, Bottoms, Activewear, and Shoes. 👗' },
    { keywords: ['kids', 'children', 'child', "kid's", 'boys', 'girls'], answer: 'Check out our <a href="/category/kids">Kids\' Collection</a>! Comfortable and stylish clothing — Tops, Bottoms, Activewear, and Shoes. 👶' },
    { keywords: ['size', 'sizing', 'size guide', 'what size', 'fit', 'too big', 'too small'], answer: 'Check the **size chart** on each product page for accurate measurements. If an item doesn\'t fit, you can <a href="/returns">exchange it</a> for a different size within 30 days — for free!' },
    { keywords: ['best seller', 'bestseller', 'popular', 'trending', 'top rated', 'recommended'], answer: 'Check out our <a href="/best-sellers">Best Sellers</a> page to see what\'s trending right now!' },
    { keywords: ['sale', 'discount', 'deal', 'offer', 'promotion', 'cheap', 'bargain'], answer: 'Check our <a href="/search">Sale & Deals</a> section for current promotions! You can also apply a **coupon code** at checkout. 🏷️' },
    { keywords: ['coupon', 'promo', 'promo code', 'coupon code', 'voucher', 'discount code'], answer: 'You can apply a **coupon code** at checkout! In the order summary, enter your code and click **Apply** to get your discount. 🏷️' },
    { keywords: ['wishlist', 'wish list', 'save for later', 'favorite', 'favourites'], answer: 'Click the ❤️ heart icon on any product to save it to your <a href="/wishlist">Wishlist</a>.' },
    { keywords: ['cart', 'shopping cart', 'add to cart', 'bag', 'basket'], answer: 'You can add items to your cart from any product page. View your <a href="/cart">Cart</a> to update quantities or proceed to checkout.' },
    { keywords: ['order', 'place order', 'how to order', 'checkout', 'buy'], answer: 'To place an order:\n\n1. Browse & add items to your cart\n2. Go to <a href="/cart">Cart</a> → Proceed to Checkout\n3. Enter your shipping address\n4. Choose payment method (COD or Card)\n5. Click "Place your order"' },
    { keywords: ['cancel', 'cancel order', 'change order', 'modify order'], answer: 'Orders can be changed or cancelled **within 1 hour** of placing them. After that, contact our <a href="/help">Help Center</a>.' },
    { keywords: ['contact', 'support', 'help', 'customer service', 'reach', 'email', 'phone', 'call'], answer: 'We\'re here for you 24/7! 🤝\n\n📧 **Email**: <a href="mailto:huraira3076@gmail.com">huraira3076@gmail.com</a>\n📞 **Phone**: <a href="tel:+923326871681">+92 332 6871681</a>\n\nVisit our <a href="/help">Help Center</a> for FAQs.' },
    { keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'howdy', 'greet'], answer: 'Hello! 👋 Welcome to FashionStore! I\'m here to help you with shipping, returns, payments, orders, and more. What can I help you with today?' },
    { keywords: ['thank', 'thanks', 'thank you', 'thx', 'appreciated', 'great help'], answer: 'You\'re welcome! 😊 Happy to help. If you have any other questions, feel free to ask anytime. Happy shopping! 🛍️' },
    { keywords: ['bye', 'goodbye', 'see you', 'later', 'close'], answer: 'Goodbye! 👋 Thanks for chatting with us. Come back anytime you need help. Happy shopping at FashionStore! 🛍️' },
];

const quickChips = [
    { label: '🚚 Shipping Info', query: 'shipping delivery options' },
    { label: '↩️ Returns', query: 'return policy refund' },
    { label: '💳 Payment', query: 'payment methods accepted' },
    { label: '📦 Track Order', query: 'track my order status' },
    { label: '🏷️ Coupons', query: 'how to use coupon code' },
    { label: '📞 Contact Us', query: 'contact support email phone' },
];

const FALLBACK_ANSWER = 'I\'m sorry, I couldn\'t find an answer for that. 🤔 You can try rephrasing, or visit our <a href="/help">Help Center</a>. You can also email us at <a href="mailto:huraira3076@gmail.com">huraira3076@gmail.com</a>.';

function findBestMatch(input: string): string {
    const words = input.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);
    if (words.length === 0) return FALLBACK_ANSWER;
    let bestScore = 0;
    let bestAnswer = FALLBACK_ANSWER;
    for (const entry of knowledgeBase) {
        let score = 0;
        for (const keyword of entry.keywords) {
            if (keyword.includes(' ')) {
                if (input.toLowerCase().includes(keyword)) score += 3;
            } else {
                for (const word of words) {
                    if (word === keyword || word.startsWith(keyword) || keyword.startsWith(word)) {
                        score += word === keyword ? 2 : 1;
                    }
                }
            }
        }
        if (score > bestScore) { bestScore = score; bestAnswer = entry.answer; }
    }
    return bestScore >= 1 ? bestAnswer : FALLBACK_ANSWER;
}

type Message = { id: number; role: 'bot' | 'user'; text: string };

const WELCOME_MSG: Message = {
    id: 0,
    role: 'bot',
    text: 'Hi there! 👋 I\'m FashionStore\'s virtual assistant. I can help you with shipping, returns, payments, orders, and more. How can I help you today?',
};

export default function ChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([WELCOME_MSG]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showChips, setShowChips] = useState(true);
    const msgEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const nextId = useRef(1);

    useEffect(() => {
        msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        setTimeout(() => inputRef.current?.focus(), 300);
    }, []);

    const sendMessage = (text: string) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        const userMsg: Message = { id: nextId.current++, role: 'user', text: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setShowChips(false);
        setIsTyping(true);
        const delay = 400 + Math.random() * 500;
        setTimeout(() => {
            const answer = findBestMatch(trimmed);
            const botMsg: Message = { id: nextId.current++, role: 'bot', text: answer };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, delay);
    };

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

    return (
        <div className="chat-page">
            {/* Header */}
            <div className="chat-page-header">
                <button
                    className="chat-page-back-btn"
                    onClick={() => router.back()}
                    aria-label="Go back"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                </button>
                <div className="chat-page-header-info">
                    <div className="chatbot-avatar">🛍️</div>
                    <div className="chatbot-header-text">
                        <h3>FashionStore Assistant</h3>
                        <p><span className="chatbot-status-dot" />Online — replies instantly</p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="chat-page-messages">
                {messages.map(msg => (
                    <div key={msg.id} className={`chatbot-msg ${msg.role}`}>
                        <div className="chatbot-msg-avatar">
                            {msg.role === 'bot' ? '🛍️' : '👤'}
                        </div>
                        <div
                            className="chatbot-msg-bubble"
                            dangerouslySetInnerHTML={{
                                __html: msg.text
                                    .replace(/\n/g, '<br/>')
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            }}
                        />
                    </div>
                ))}

                {isTyping && (
                    <div className="chatbot-msg bot">
                        <div className="chatbot-msg-avatar">🛍️</div>
                        <div className="chatbot-msg-bubble">
                            <div className="chatbot-typing">
                                <span className="chatbot-typing-dot" />
                                <span className="chatbot-typing-dot" />
                                <span className="chatbot-typing-dot" />
                            </div>
                        </div>
                    </div>
                )}

                {showChips && (
                    <div className="chatbot-chips">
                        {quickChips.map(chip => (
                            <button
                                key={chip.label}
                                className="chatbot-chip"
                                onClick={() => sendMessage(chip.query)}
                            >
                                {chip.label}
                            </button>
                        ))}
                    </div>
                )}

                <div ref={msgEndRef} />
            </div>

            {/* Input */}
            <form className="chat-page-input-area" onSubmit={handleSubmit}>
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your question..."
                    aria-label="Chat message"
                    id="chat-page-input"
                />
                <button
                    type="submit"
                    className="chatbot-send-btn"
                    disabled={!input.trim()}
                    aria-label="Send message"
                    id="chat-page-send"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                </button>
            </form>

            <div className="chatbot-footer">Powered by FashionStore</div>
        </div>
    );
}
