# FUTURE SCOPE — Energy Passport

> Ideas NOT built in MVP. Reference here before starting new features.

---

## Deferred Features

### AI/LLM Recommendation
- Use Gemini API to generate personalized drink suggestions based on full history
- Requires: user history context, prompt engineering, API cost management

### Payment Gateway
- Integrated checkout (VNPay, MoMo, Stripe)
- Requires: payment provider integration, order management, compliance

### Delivery API Integration
- Grab Food, ShopeeFood, BeFood deep-links or native order APIs
- Requires: partner API agreements, menu sync logic

### Dynamic QR Per Order
- Generate QR per sale transaction (ties purchase to specific cup/order)
- Requires: POS integration or manual order flow
- Enables: proof-of-purchase vs. just proof-of-consumption

### Loyalty Points / Gamification Economy
- Earn points per scan, redeem for rewards
- Requires: points ledger, reward catalog, expiry logic

### Advanced Analytics Dashboard
- Admin analytics: daily/weekly trends, popular products, user retention
- Requires: aggregation queries, charting library

### Social Features
- Share check-in / recommendation to social media
- Community challenges / leaderboards
- Requires: social graph, content moderation

### Push Notifications
- Remind users to check-in, announce new products
- Requires: web push infrastructure, user consent management

### Native Mobile App
- iOS/Android app for better QR scanning experience
- Requires: React Native or Flutter development

### State History Analytics
- Visualize energy patterns over time (morning vs. afternoon, weekday vs. weekend)
- Requires: time-series analysis, charting

### Multi-location Support
- Different menus per café location
- Requires: location model, menu-location join table

### Ingredient/Allergen Info
- Detailed ingredient lists, allergen warnings
- Requires: ingredient data entry, allergen tagging

### Configurable External Order Links
- Admin can set Grab/ShopeeFood URLs per product
- Simple P1 feature — add `order_url` field to products table
