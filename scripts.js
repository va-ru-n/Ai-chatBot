// Sample order data with Indian Rupee prices
const orders = {
    'ct-2023-0567': {
        id: 'CT-2023-0567',
        customer: 'Priya Sharma',
        date: '15 May 2023',
        status: 'shipped',
        items: [
            { name: 'Premium Wool Yarn', quantity: 5, price: 299 },
            { name: 'Knitting Needles Set', quantity: 1, price: 599 },
            { name: 'Craft Storage Box', quantity: 2, price: 249 }
        ],
        total: 2295,
        tracking: 'DTDC-9348-5729-3847',
        origin: 'Mumbai, Maharashtra',
        destination: 'Bangalore, Karnataka',
        currentLocation: 'Bangalore, Karnataka',
        eta: '17 May 2023',
        history: [
            { date: '15 May, 10:30 AM', status: 'Order Placed', description: 'Order received and payment processed' },
            { date: '15 May, 2:15 PM', status: 'Processing', description: 'Order is being prepared for shipment' },
            { date: '16 May, 9:45 AM', status: 'Shipped', description: 'Package left our warehouse in Mumbai' },
            { date: '16 May, 6:30 PM', status: 'In Transit', description: 'Package arrived at Bangalore distribution center' }
        ]
    },
    'ct-2023-0566': {
        id: 'CT-2023-0566',
        customer: 'Rahul Patel',
        date: '14 May 2023',
        status: 'processing',
        items: [
            { name: 'Cotton Fabric Bundle', quantity: 3, price: 450 },
            { name: 'Sewing Thread Set', quantity: 1, price: 199 }
        ],
        total: 1549,
        tracking: 'BLUEDART-7382-4920',
        origin: 'Delhi',
        destination: 'Hyderabad, Telangana',
        currentLocation: 'Warehouse',
        eta: '19 May 2023',
        history: [
            { date: '14 May, 4:45 PM', status: 'Order Placed', description: 'Order received and payment processed' },
            { date: '15 May, 11:20 AM', status: 'Processing', description: 'Order is being prepared for shipment' }
        ]
    },
    'ct-2023-0565': {
        id: 'CT-2023-0565',
        customer: 'Ananya Gupta',
        date: '14 May 2023',
        status: 'delivered',
        items: [
            { name: 'Bead Assortment Kit', quantity: 1, price: 799 },
            { name: 'Jewelry Pliers Set', quantity: 1, price: 499 },
            { name: 'Beading Thread', quantity: 2, price: 99 }
        ],
        total: 1496,
        tracking: 'DELHIVERY-5829-3948',
        origin: 'Chennai, Tamil Nadu',
        destination: 'Pune, Maharashtra',
        currentLocation: 'Delivered',
        deliveredDate: '16 May 2023 at 2:15 PM',
        eta: 'Delivered',
        history: [
            { date: '14 May, 1:30 PM', status: 'Order Placed', description: 'Order received and payment processed' },
            { date: '14 May, 4:45 PM', status: 'Processing', description: 'Order is being prepared for shipment' },
            { date: '15 May, 10:15 AM', status: 'Shipped', description: 'Package left our warehouse in Chennai' },
            { date: '15 May, 8:30 PM', status: 'In Transit', description: 'Package arrived at Pune distribution center' },
            { date: '16 May, 2:15 PM', status: 'Delivered', description: 'Package delivered to customer' }
        ]
    }
};

// Search history
let searchHistory = JSON.parse(localStorage.getItem('craftTrackHistory')) || [];

// Format currency in Indian Rupees
function formatINR(amount) {
    return '₹' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// DOM elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const searchBtn = document.getElementById('search-btn');
const orderSearch = document.getElementById('order-search');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history');

// Initialize the app
function init() {
    // Add event listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    searchBtn.addEventListener('click', searchOrder);
    orderSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchOrder();
    });
    
    suggestionBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.textContent === 'Help') {
                showHelp();
            } else {
                orderSearch.value = btn.textContent;
                searchOrder();
            }
        });
    });
    
    clearHistoryBtn.addEventListener('click', clearSearchHistory);
    
    // Render initial search history
    renderSearchHistory();
}

// Send a message
function sendMessage() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process the message after a short delay
    setTimeout(() => {
        removeTypingIndicator();
        processUserMessage(message);
    }, 1000 + Math.random() * 1000);
}

// Search for an order (case-insensitive)
function searchOrder() {
    const query = orderSearch.value.trim();
    if (query === '') return;
    
    const orderId = query.toLowerCase().replace('#', '');
    
    // Add to search history
    addToSearchHistory(query);
    
    // Add search to chat (show original case in chat)
    addMessage(`Track order #${query.replace('#', '')}`, 'user');
    orderSearch.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process the search after a short delay
    setTimeout(() => {
        removeTypingIndicator();
        showOrderDetails(orderId);
    }, 1000 + Math.random() * 1000);
}

// Add to search history
function addToSearchHistory(query) {
    const now = new Date();
    const timeString = formatTime(now);
    
    searchHistory.unshift({
        query: query,
        time: timeString
    });
    
    // Keep only last 10 searches
    if (searchHistory.length > 10) {
        searchHistory = searchHistory.slice(0, 10);
    }
    
    // Save to localStorage
    localStorage.setItem('craftTrackHistory', JSON.stringify(searchHistory));
    
    // Update history display
    renderSearchHistory();
}

// Format time for display
function formatTime(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
        return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
}

// Render search history
function renderSearchHistory() {
    historyList.innerHTML = '';
    
    searchHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <div class="history-query">${item.query}</div>
            <div class="history-time">${item.time}</div>
        `;
        historyItem.addEventListener('click', () => {
            orderSearch.value = item.query;
            searchOrder();
        });
        historyList.appendChild(historyItem);
    });
}

// Clear search history
function clearSearchHistory(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to clear your search history?')) {
        searchHistory = [];
        localStorage.setItem('craftTrackHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}

// Add message to chat
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add rich message to chat (can contain HTML)
function addRichMessage(html, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.innerHTML = html;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.id = 'typing-indicator';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('typing-dot');
        typingDiv.appendChild(dot);
    }
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingDiv = document.getElementById('typing-indicator');
    if (typingDiv) {
        typingDiv.remove();
    }
}

// Process user message
function processUserMessage(message) {
    const lowerMsg = message.toLowerCase();
    
    if (lowerMsg.includes('track') || lowerMsg.includes('order') || lowerMsg.includes('status')) {
        handleOrderTracking(message);
    } 
    else if (lowerMsg.includes('help')) {
        showHelp();
    }
    else if (lowerMsg.includes('thank') || lowerMsg.includes('thanks')) {
        addMessage("You're welcome! Happy crafting!", 'bot');
    }
    else {
        addMessage("I'm not sure I understand. Try asking about order tracking or say 'help' for options.", 'bot');
    }
}

// Handle order tracking from chat message (case-insensitive)
function handleOrderTracking(message) {
    // Extract order ID from message (case-insensitive)
    const orderIdMatch = message.match(/#?[a-zA-Z]{2}-\d{4}-\d{4}/i);
    if (!orderIdMatch) {
        addMessage("Please provide a valid order ID (like #CT-2023-0567) so I can track it for you.", 'bot');
        return;
    }
    
    const orderId = orderIdMatch[0].toLowerCase().replace('#', '');
    const displayOrderId = orderIdMatch[0].replace('#', '');
    
    // Add to search history
    addToSearchHistory(`#${displayOrderId}`);
    
    if (orders[orderId]) {
        showOrderDetails(orderId);
    } else {
        addMessage(`I couldn't find order #${displayOrderId}. Please check the order ID and try again.`, 'bot');
    }
}

// Show order details
function showOrderDetails(orderId) {
    const order = orders[orderId];
    if (!order) {
        addMessage(`Order #${orderId.toUpperCase()} not found. Please check the order ID and try again.`, 'bot');
        return;
    }
    
    let statusClass = '';
    let statusText = '';
    
    switch(order.status) {
        case 'pending':
            statusClass = 'status-pending';
            statusText = 'Pending';
            break;
        case 'processing':
            statusClass = 'status-processing';
            statusText = 'Processing';
            break;
        case 'shipped':
            statusClass = 'status-shipped';
            statusText = 'Shipped';
            break;
        case 'delivered':
            statusClass = 'status-delivered';
            statusText = 'Delivered';
            break;
    }
    
    // Determine which status steps are completed
    const steps = [
        { id: 'placed', label: 'Order Placed', completed: true },
        { id: 'processing', label: 'Processing', completed: order.status !== 'pending' },
        { id: 'shipped', label: 'Shipped', completed: order.status === 'shipped' || order.status === 'delivered' },
        { id: 'delivery', label: 'Out for Delivery', completed: order.status === 'delivered' },
        { id: 'delivered', label: 'Delivered', completed: order.status === 'delivered' }
    ];
    
    // Find the current active step
    const activeStep = order.status === 'pending' ? 'placed' : 
                      order.status === 'processing' ? 'processing' :
                      order.status === 'shipped' ? 'shipped' :
                      order.status === 'delivered' ? 'delivered' : 'placed';
    
    let html = `
        <div class="order-card">
            <h4>Order #${order.id}</h4>
            <div class="order-status ${statusClass}">${statusText}</div>
            <p><strong>Customer:</strong> ${order.customer}</p>
            <p><strong>Date:</strong> ${order.date}</p>
            <p><strong>Tracking #:</strong> ${order.tracking}</p>
            ${order.deliveredDate ? `<p><strong>Delivered:</strong> ${order.deliveredDate}</p>` : ''}
            <p><strong>Current Location:</strong> ${order.currentLocation}</p>
            <p><strong>Estimated Delivery:</strong> ${order.eta}</p>
            
            <div class="status-tracker">
    `;
    
    // Add status steps
    steps.forEach(step => {
        const isActive = step.id === activeStep;
        const isCompleted = step.completed;
        
        html += `
            <div class="status-step">
                <div class="status-icon ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}">
                    ${isCompleted ? '<i class="fas fa-check"></i>' : ''}
                </div>
                <div class="status-label ${isActive ? 'active' : ''}">${step.label}</div>
            </div>
        `;
    });
    
    html += `
            </div>
            
            <div class="order-items">
                <p><strong>Items:</strong></p>
    `;
    
    // Add order items with Indian Rupee symbol
    order.items.forEach(item => {
        html += `
            <div class="order-item">
                <span>${item.quantity} × ${item.name}</span>
                <span class="rupee-symbol">${item.price.toFixed(2)}</span>
            </div>
        `;
    });
    
    // Add order total with Indian Rupee symbol
    html += `
            <div class="order-summary">
                <span>Total:</span>
                <span class="rupee-symbol">${order.total.toFixed(2)}</span>
            </div>
            </div>
            
            <div class="tracking-map">
                <i class="fas fa-map-marked-alt"></i>
                <p>Package is ${order.status === 'delivered' ? 'delivered' : 'on its way'} to ${order.destination}</p>
            </div>
        </div>
    `;
    
    addRichMessage(html, 'bot');
}

// Show help
function showHelp() {
    const helpText = `Here's how I can help you:
    
<strong>Order Tracking:</strong>
- "Track order #CT-2023-0567"
- "Where is my order?"
- "What's the status of CT-2023-0566?"

<strong>Quick Actions:</strong>
- Click the suggestion buttons to track sample orders
- Enter any order ID in the search box above

<strong>Order Status Meanings:</strong>
- <span class="status-pending" style="padding: 2px 5px;">Pending</span>: Order received, not yet processed
- <span class="status-processing" style="padding: 2px 5px;">Processing</span>: Preparing your order for shipment
- <span class="status-shipped" style="padding: 2px 5px;">Shipped</span>: Package is on its way
- <span class="status-delivered" style="padding: 2px 5px;">Delivered</span>: Package has arrived`;
    
    addRichMessage(helpText, 'bot');
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
