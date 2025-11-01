// ============================================
// Firebase Service dengan Firestore
// ============================================

class FirebaseService {
    constructor() {
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.currentUserId = null;
        
        // Setup auth state listener
        this.auth.onAuthStateChanged((user) => {
            this.currentUserId = user ? user.uid : null;
        });
    }

    // Authentication Methods
    async signIn(email, password) {
        console.log('🔑 FirebaseService: Attempting signIn...');
        try {
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            this.currentUserId = userCredential.user.uid;
            console.log('✅ SignIn successful, UID:', this.currentUserId);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('❌ SignIn error:', error.code, error.message);
            return { success: false, error: error.message };
        }
    }

    async signUp(email, password) {
        console.log('📝 FirebaseService: Creating new user...');
        try {
            const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
            this.currentUserId = userCredential.user.uid;
            console.log('✅ SignUp successful, UID:', this.currentUserId);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('❌ SignUp error:', error.code, error.message);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
            this.currentUserId = null;
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async changePassword(newPassword) {
        try {
            const user = this.auth.currentUser;
            if (user) {
                await user.updatePassword(newPassword);
                return { success: true };
            }
            return { success: false, error: 'No user logged in' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    getCurrentUser() {
        return this.auth.currentUser;
    }

    isAuthenticated() {
        return this.currentUserId !== null;
    }

    // Firestore Methods - Products
    async getProducts() {
        if (!this.currentUserId) return [];
        try {
            const snapshot = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('products')
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Get products error:', error);
            return [];
        }
    }

    async addProduct(product) {
        if (!this.currentUserId) return null;
        try {
            const docRef = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('products')
                .add(product);
            return docRef.id;
        } catch (error) {
            console.error('Add product error:', error);
            return null;
        }
    }

    async updateProduct(id, product) {
        if (!this.currentUserId) return false;
        try {
            await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('products')
                .doc(id)
                .update(product);
            return true;
        } catch (error) {
            console.error('Update product error:', error);
            return false;
        }
    }

    async deleteProduct(id) {
        if (!this.currentUserId) return false;
        try {
            await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('products')
                .doc(id)
                .delete();
            return true;
        } catch (error) {
            console.error('Delete product error:', error);
            return false;
        }
    }

    // Firestore Methods - Restocks
    async getRestocks() {
        if (!this.currentUserId) return [];
        try {
            const snapshot = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('restocks')
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Get restocks error:', error);
            return [];
        }
    }

    async addRestock(restock) {
        if (!this.currentUserId) return null;
        try {
            const docRef = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('restocks')
                .add(restock);
            return docRef.id;
        } catch (error) {
            console.error('Add restock error:', error);
            return null;
        }
    }

    async updateRestock(id, restock) {
        if (!this.currentUserId) return false;
        try {
            await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('restocks')
                .doc(id)
                .update(restock);
            return true;
        } catch (error) {
            console.error('Update restock error:', error);
            return false;
        }
    }

    async deleteRestock(id) {
        if (!this.currentUserId) return false;
        try {
            await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('restocks')
                .doc(id)
                .delete();
            return true;
        } catch (error) {
            console.error('Delete restock error:', error);
            return false;
        }
    }

    // Firestore Methods - Sales
    async getSales() {
        if (!this.currentUserId) return [];
        try {
            const snapshot = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('sales')
                .get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Get sales error:', error);
            return [];
        }
    }

    async addSale(sale) {
        if (!this.currentUserId) return null;
        try {
            const docRef = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('sales')
                .add(sale);
            return docRef.id;
        } catch (error) {
            console.error('Add sale error:', error);
            return null;
        }
    }

    async updateSale(id, sale) {
        if (!this.currentUserId) return false;
        try {
            await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('sales')
                .doc(id)
                .update(sale);
            return true;
        } catch (error) {
            console.error('Update sale error:', error);
            return false;
        }
    }

    async deleteSale(id) {
        if (!this.currentUserId) return false;
        try {
            await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('sales')
                .doc(id)
                .delete();
            return true;
        } catch (error) {
            console.error('Delete sale error:', error);
            return false;
        }
    }

    // Real-time listeners
    onProductsChange(callback) {
        if (!this.currentUserId) return () => {};
        return this.db
            .collection('users')
            .doc(this.currentUserId)
            .collection('products')
            .onSnapshot((snapshot) => {
                const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(products);
            });
    }

    onRestocksChange(callback) {
        if (!this.currentUserId) return () => {};
        return this.db
            .collection('users')
            .doc(this.currentUserId)
            .collection('restocks')
            .onSnapshot((snapshot) => {
                const restocks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(restocks);
            });
    }

    onSalesChange(callback) {
        if (!this.currentUserId) return () => {};
        return this.db
            .collection('users')
            .doc(this.currentUserId)
            .collection('sales')
            .onSnapshot((snapshot) => {
                const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                callback(sales);
            });
    }

    // Clear all data
    async clearAllData() {
        if (!this.currentUserId) return false;
        try {
            const batch = this.db.batch();
            
            // Delete all products
            const products = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('products')
                .get();
            products.docs.forEach(doc => batch.delete(doc.ref));
            
            // Delete all restocks
            const restocks = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('restocks')
                .get();
            restocks.docs.forEach(doc => batch.delete(doc.ref));
            
            // Delete all sales
            const sales = await this.db
                .collection('users')
                .doc(this.currentUserId)
                .collection('sales')
                .get();
            sales.docs.forEach(doc => batch.delete(doc.ref));
            
            await batch.commit();
            return true;
        } catch (error) {
            console.error('Clear data error:', error);
            return false;
        }
    }
}

// Initialize Firebase Service
const firebaseService = new FirebaseService();

// ============================================
// Authentication Manager
// ============================================

class AuthManager {
    constructor(firebaseService) {
        this.firebase = firebaseService;
    }

    async login(email, password) {
        console.log('🔐 AuthManager: Attempting login for', email);
        
        try {
            const result = await this.firebase.signIn(email, password);
            console.log('📧 SignIn result:', result);
            
            // Check if user doesn't exist - handle multiple error codes
            if (!result.success && (
                result.error.includes('user-not-found') || 
                result.error.includes('invalid-credential') ||
                result.error.includes('wrong-password')
            )) {
                // Auto-create user if not exists
                console.log('👤 User not found or invalid credential, creating new account...');
                const signupResult = await this.firebase.signUp(email, password);
                console.log('📝 SignUp result:', signupResult);
                
                // If email already exists, it means wrong password
                if (!signupResult.success && signupResult.error.includes('email-already-in-use')) {
                    console.error('❌ Email already registered with different password');
                    return false;
                }
                
                return signupResult.success;
            }
            return result.success;
        } catch (error) {
            console.error('❌ AuthManager login error:', error);
            throw error;
        }
    }

    isLoggedIn() {
        return this.firebase.isAuthenticated();
    }

    async logout() {
        await this.firebase.signOut();
    }

    async changePassword(oldPassword, newPassword) {
        // Firebase doesn't need old password for updatePassword
        // But we keep the signature for compatibility
        const result = await this.firebase.changePassword(newPassword);
        return result.success;
    }
}

// ============================================
// Data Manager
// ============================================

class DataManager {
    constructor(firebaseService) {
        this.firebase = firebaseService;
        this.products = [];
        this.restocks = [];
        this.sales = [];
        this.listeners = [];
    }

    async init() {
        // Load initial data
        this.products = await this.firebase.getProducts();
        this.restocks = await this.firebase.getRestocks();
        this.sales = await this.firebase.getSales();
        
        // Setup real-time listeners
        this.listeners.push(
            this.firebase.onProductsChange((products) => {
                this.products = products;
                if (window.ui) {
                    window.ui.renderProducts();
                    window.ui.renderStock();
                    window.ui.renderDashboard();
                }
            })
        );
        
        this.listeners.push(
            this.firebase.onRestocksChange((restocks) => {
                this.restocks = restocks;
                if (window.ui) {
                    window.ui.renderRestocks();
                    window.ui.renderStock();
                    window.ui.renderDashboard();
                }
            })
        );
        
        this.listeners.push(
            this.firebase.onSalesChange((sales) => {
                this.sales = sales;
                if (window.ui) {
                    window.ui.renderSales();
                    window.ui.renderStock();
                    window.ui.renderDashboard();
                    window.ui.renderReports();
                }
            })
        );
    }

    cleanup() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }

    // Products
    async addProduct(product) {
        const id = await this.firebase.addProduct(product);
        return id;
    }

    async updateProduct(id, product) {
        return await this.firebase.updateProduct(id, product);
    }

    async deleteProduct(id) {
        return await this.firebase.deleteProduct(id);
    }

    getProduct(id) {
        return this.products.find(p => p.id === id);
    }

    getAllProducts() {
        return this.products;
    }

    // Restocks
    async addRestock(restock) {
        const id = await this.firebase.addRestock(restock);
        return id;
    }

    async updateRestock(id, restock) {
        return await this.firebase.updateRestock(id, restock);
    }

    async deleteRestock(id) {
        return await this.firebase.deleteRestock(id);
    }

    getRestock(id) {
        return this.restocks.find(r => r.id === id);
    }

    getAllRestocks() {
        return this.restocks;
    }

    // Sales
    async addSale(sale) {
        const product = this.getProduct(sale.productId);
        if (!product) return null;

        const fifoResult = this.calculateCostFIFO(sale.productId, sale.quantity);
        
        const newSale = {
            ...sale,
            sellPrice: product.sellPrice,
            revenue: sale.quantity * product.sellPrice,
            cost: fifoResult.totalCost,
            profit: (sale.quantity * product.sellPrice) - fifoResult.totalCost
        };

        const id = await this.firebase.addSale(newSale);
        return id;
    }

    async updateSale(id, updatedSale) {
        const product = this.getProduct(updatedSale.productId);
        if (!product) return false;

        const fifoResult = this.calculateCostFIFO(updatedSale.productId, updatedSale.quantity, id);
        
        const newSale = {
            ...updatedSale,
            sellPrice: product.sellPrice,
            revenue: updatedSale.quantity * product.sellPrice,
            cost: fifoResult.totalCost,
            profit: (updatedSale.quantity * product.sellPrice) - fifoResult.totalCost
        };

        return await this.firebase.updateSale(id, newSale);
    }

    async deleteSale(id) {
        return await this.firebase.deleteSale(id);
    }

    getSale(id) {
        return this.sales.find(s => s.id === id);
    }

    getAllSales() {
        return this.sales;
    }

    // FIFO Calculation
    calculateCostFIFO(productId, quantity, excludeSaleId = null) {
        const productRestocks = this.restocks
            .filter(r => r.productId === productId)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const productSales = this.sales
            .filter(s => s.productId === productId && s.id !== excludeSaleId)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        const stockLevels = productRestocks.map(restock => ({
            ...restock,
            remaining: restock.quantity
        }));

        for (const sale of productSales) {
            let remainingToDeduct = sale.quantity;
            
            for (const stock of stockLevels) {
                if (remainingToDeduct <= 0) break;
                
                const deductAmount = Math.min(stock.remaining, remainingToDeduct);
                stock.remaining -= deductAmount;
                remainingToDeduct -= deductAmount;
            }
        }

        let remainingToSell = quantity;
        let totalCost = 0;

        for (const stock of stockLevels) {
            if (remainingToSell <= 0) break;
            
            const useAmount = Math.min(stock.remaining, remainingToSell);
            totalCost += useAmount * stock.buyPrice;
            remainingToSell -= useAmount;
        }

        return {
            totalCost,
            success: remainingToSell === 0
        };
    }

    // Stock Calculation
    getStockForProduct(productId) {
        const totalRestock = this.restocks
            .filter(r => r.productId === productId)
            .reduce((sum, r) => sum + r.quantity, 0);

        const totalSold = this.sales
            .filter(s => s.productId === productId)
            .reduce((sum, s) => sum + s.quantity, 0);

        return {
            totalRestock,
            totalSold,
            remaining: totalRestock - totalSold
        };
    }

    // Dashboard Statistics
    getDashboardStats() {
        const totalRevenue = this.sales.reduce((sum, s) => sum + s.revenue, 0);
        const totalProfit = this.sales.reduce((sum, s) => sum + s.profit, 0);
        const totalSold = this.sales.reduce((sum, s) => sum + s.quantity, 0);
        const profitPercentage = totalRevenue > 0 ? (totalProfit / totalRevenue * 100) : 0;

        return {
            totalRevenue,
            totalProfit,
            totalSold,
            profitPercentage
        };
    }

    // Report by Date Range
    getReportByDateRange(startDate, endDate) {
        const filteredSales = this.sales.filter(s => {
            const saleDate = new Date(s.date);
            return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
        });

        const productMap = {};

        filteredSales.forEach(sale => {
            if (!productMap[sale.productId]) {
                const product = this.getProduct(sale.productId);
                productMap[sale.productId] = {
                    productName: product ? product.name : 'Unknown',
                    quantity: 0,
                    revenue: 0,
                    cost: 0,
                    profit: 0
                };
            }

            productMap[sale.productId].quantity += sale.quantity;
            productMap[sale.productId].revenue += sale.revenue;
            productMap[sale.productId].cost += sale.cost;
            productMap[sale.productId].profit += sale.profit;
        });

        return Object.values(productMap);
    }
}

class UIManager {
    constructor(dataManager) {
        this.dm = dataManager;
        this.currentPage = 'dashboard';
        this.initializeEventListeners();
        this.updateCurrentDate();
        this.renderDashboard();
    }

    initializeEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateToPage(page);
            });
        });

        // Modal
        const modal = document.getElementById('modal');
        const closeModal = document.querySelector('.close-modal');
        
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });

        // Button listeners
        document.getElementById('add-product-btn').addEventListener('click', () => this.showProductForm());
        document.getElementById('add-restock-btn').addEventListener('click', () => this.showRestockForm());
        document.getElementById('add-sale-btn').addEventListener('click', () => this.showSaleForm());
        document.getElementById('filter-report-btn').addEventListener('click', () => this.filterReport());
        document.getElementById('export-excel-btn').addEventListener('click', () => this.exportToExcel());
        document.getElementById('reset-data-btn').addEventListener('click', () => this.resetAllData());
        
        // Logout button
        document.getElementById('logout-btn').addEventListener('click', () => {
            this.showConfirmModal(
                'Konfirmasi Logout',
                'Yakin ingin keluar dari aplikasi?',
                () => {
                    auth.logout();
                    location.reload();
                },
                null,
                true // isLogout = true
            );
        });
    }

    navigateToPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Update pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        document.getElementById(`${page}-page`).classList.add('active');

        // Update title
        const titles = {
            'dashboard': 'Dashboard',
            'products': 'Master Produk',
            'restock': 'Restok Barang',
            'sales': 'Penjualan',
            'stock': 'Stok Barang',
            'reports': 'Laporan',
            'settings': 'Pengaturan'
        };
        document.getElementById('page-title').textContent = titles[page];

        // Render content
        this.currentPage = page;
        this.renderCurrentPage();
    }

    renderCurrentPage() {
        switch(this.currentPage) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'products':
                this.renderProducts();
                break;
            case 'restock':
                this.renderRestocks();
                break;
            case 'sales':
                this.renderSales();
                break;
            case 'stock':
                this.renderStock();
                break;
            case 'reports':
                this.renderReports();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

    updateCurrentDate() {
        const dateDisplay = document.getElementById('current-date');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('id-ID', options);
        dateDisplay.textContent = today;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    // Dashboard Rendering
    renderDashboard() {
        const stats = this.dm.getDashboardStats();
        
        document.getElementById('total-revenue').textContent = this.formatCurrency(stats.totalRevenue);
        document.getElementById('total-profit').textContent = this.formatCurrency(stats.totalProfit);
        document.getElementById('profit-percentage').textContent = stats.profitPercentage.toFixed(2) + '%';
        document.getElementById('total-sold').textContent = stats.totalSold + ' item';

        this.renderSalesChart();
    }

    renderSalesChart() {
        const ctx = document.getElementById('salesChart');
        
        // Get sales data grouped by product
        const salesByProduct = {};
        this.dm.getAllSales().forEach(sale => {
            const product = this.dm.getProduct(sale.productId);
            if (!salesByProduct[product.name]) {
                salesByProduct[product.name] = 0;
            }
            salesByProduct[product.name] += sale.revenue;
        });

        const labels = Object.keys(salesByProduct);
        const data = Object.values(salesByProduct);

        // Destroy previous chart if exists
        if (window.salesChart && typeof window.salesChart.destroy === 'function') {
            window.salesChart.destroy();
        }

        window.salesChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.length > 0 ? labels : ['Belum ada data'],
                datasets: [{
                    label: 'Pendapatan (Rp)',
                    data: data.length > 0 ? data : [0],
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Products Rendering
    renderProducts() {
        const tbody = document.getElementById('products-tbody');
        const products = this.dm.getAllProducts();

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Belum ada produk</td></tr>';
            return;
        }

        tbody.innerHTML = products.map((product, index) => {
            const stock = this.dm.getStockForProduct(product.id);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${this.formatCurrency(product.sellPrice)}</td>
                    <td>${stock.remaining} item</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-product-btn" data-id="${product.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-product-btn" data-id="${product.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Add event listeners
        tbody.querySelectorAll('.edit-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.showProductForm(id);
            });
        });

        tbody.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.deleteProduct(id);
            });
        });
    }

    showProductForm(productId = null) {
        const product = productId ? this.dm.getProduct(productId) : null;
        const title = product ? 'Edit Produk' : 'Tambah Produk';
        
        const formHTML = `
            <form id="product-form">
                <div class="form-group">
                    <label>Nama Produk *</label>
                    <input type="text" class="form-input" id="product-name" value="${product ? product.name : ''}" required>
                </div>
                <div class="form-group">
                    <label>Harga Jual *</label>
                    <input type="number" class="form-input" id="product-sell-price" value="${product ? product.sellPrice : ''}" required>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn" onclick="document.getElementById('modal').classList.remove('active')">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        this.showModal(title, formHTML);

        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const productData = {
                name: document.getElementById('product-name').value,
                sellPrice: parseFloat(document.getElementById('product-sell-price').value)
            };

            if (product) {
                this.dm.updateProduct(productId, productData);
            } else {
                this.dm.addProduct(productData);
            }

            document.getElementById('modal').classList.remove('active');
            this.renderProducts();
            this.renderDashboard();
        });
    }

    deleteProduct(id) {
        const product = this.dm.getProduct(id);
        
        if (!product) {
            alert('Produk tidak ditemukan!');
            return;
        }
        
        // Use custom modal instead of confirm()
        this.showConfirmModal(
            'Hapus Produk?',
            `<div style="text-align: center;">
                <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">⚠️</div>
                <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">
                    ${product.name}
                </p>
                <p style="color: #6b7280; margin-bottom: 1rem;">
                    Harga: ${this.formatCurrency(product.sellPrice)}
                </p>
                <p style="background: #fef3c7; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">
                    ⚠️ Data restok dan penjualan produk ini akan tetap ada
                </p>
            </div>`,
            () => {
                // On confirm
                this.dm.deleteProduct(id);
                
                this.renderProducts();
                this.renderStock();
                this.renderDashboard();
                
                this.showSuccessAlert('Produk berhasil dihapus!');
            }
        );
    }

    // Restocks Rendering
    renderRestocks() {
        const tbody = document.getElementById('restock-tbody');
        const restocks = this.dm.getAllRestocks();

        if (restocks.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada transaksi restok</td></tr>';
            return;
        }

        tbody.innerHTML = restocks.map((restock, index) => {
            const product = this.dm.getProduct(restock.productId);
            // Calculate totalCapital if not exists (for backward compatibility)
            const totalCapital = restock.totalCapital || (restock.buyPrice * restock.quantity);
            const buyPrice = restock.buyPrice || 0;
            
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${new Date(restock.date).toLocaleDateString('id-ID')}</td>
                    <td>${product ? product.name : 'Produk Dihapus'}</td>
                    <td>${restock.quantity} pcs</td>
                    <td>${this.formatCurrency(totalCapital)}</td>
                    <td>${this.formatCurrency(buyPrice)}</td>
                    <td>${this.formatCurrency(totalCapital)}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-restock-btn" data-id="${restock.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-restock-btn" data-id="${restock.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Add event listeners
        tbody.querySelectorAll('.edit-restock-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.showRestockForm(id);
            });
        });

        tbody.querySelectorAll('.delete-restock-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.deleteRestock(id);
            });
        });
    }

    showRestockForm(restockId = null) {
        const restock = restockId ? this.dm.getAllRestocks().find(r => r.id === restockId) : null;
        const title = restock ? 'Edit Restok' : 'Tambah Restok';
        const products = this.dm.getAllProducts();
        
        // Use totalCapital if exists, otherwise calculate from buyPrice * quantity
        const totalPrice = restock ? (restock.totalCapital || (restock.buyPrice * restock.quantity)) : 0;
        
        const formHTML = `
            <form id="restock-form">
                <div class="form-group">
                    <label>Tanggal *</label>
                    <input type="date" class="form-input" id="restock-date" value="${restock ? restock.date : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label>Produk *</label>
                    <select class="form-select" id="restock-product" required>
                        <option value="">Pilih Produk</option>
                        ${products.map(p => `
                            <option value="${p.id}" ${restock && restock.productId === p.id ? 'selected' : ''}>
                                ${p.name}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Jumlah Item *</label>
                    <input type="number" class="form-input" id="restock-quantity" value="${restock ? restock.quantity : ''}" required>
                    <small style="color: #6b7280; font-size: 0.75rem;">Contoh: 24 botol</small>
                </div>
                <div class="form-group">
                    <label>Harga Beli Total *</label>
                    <input type="number" class="form-input" id="restock-total-price" value="${totalPrice || ''}" required>
                    <small style="color: #6b7280; font-size: 0.75rem;">Contoh: Rp 40.000 untuk 1 dus</small>
                </div>
                <div class="form-group" style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                    <label style="margin-bottom: 0.5rem;">Harga Satuan (Otomatis)</label>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #1f2937;" id="calculated-unit-price">
                        ${restock ? this.formatCurrency(restock.buyPrice) : 'Rp 0'}
                    </div>
                    <small style="color: #6b7280; font-size: 0.75rem;">Harga beli total ÷ jumlah item</small>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn" onclick="document.getElementById('modal').classList.remove('active')">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        this.showModal(title, formHTML);

        // Auto calculate unit price
        const quantityInput = document.getElementById('restock-quantity');
        const totalPriceInput = document.getElementById('restock-total-price');
        const unitPriceDisplay = document.getElementById('calculated-unit-price');

        const calculateUnitPrice = () => {
            const quantity = parseFloat(quantityInput.value) || 0;
            const totalPrice = parseFloat(totalPriceInput.value) || 0;
            
            if (quantity > 0 && totalPrice > 0) {
                const unitPrice = totalPrice / quantity;
                unitPriceDisplay.textContent = this.formatCurrency(unitPrice);
            } else {
                unitPriceDisplay.textContent = 'Rp 0';
            }
        };

        quantityInput.addEventListener('input', calculateUnitPrice);
        totalPriceInput.addEventListener('input', calculateUnitPrice);

        document.getElementById('restock-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const quantity = parseInt(document.getElementById('restock-quantity').value);
            const totalPrice = parseFloat(document.getElementById('restock-total-price').value);
            const unitPrice = totalPrice / quantity;

            const restockData = {
                date: document.getElementById('restock-date').value,
                productId: document.getElementById('restock-product').value,
                quantity: quantity,
                buyPrice: unitPrice,
                totalCapital: totalPrice  // Tambahkan total capital
            };

            if (restock) {
                this.dm.updateRestock(restockId, restockData);
            } else {
                this.dm.addRestock(restockData);
            }

            document.getElementById('modal').classList.remove('active');
            this.renderRestocks();
            this.renderStock();
            this.renderDashboard();
        });
    }

    deleteRestock(id) {
        const restock = this.dm.getAllRestocks().find(r => r.id === id);
        const product = this.dm.getProduct(restock.productId);
        
        this.showConfirmModal(
            'Hapus Restok?',
            `<div style="text-align: center;">
                <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">⚠️</div>
                <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">
                    ${product ? product.name : 'Produk Dihapus'}
                </p>
                <p style="color: #6b7280; margin-bottom: 0.5rem;">
                    Tanggal: ${new Date(restock.date).toLocaleDateString('id-ID')}
                </p>
                <p style="color: #6b7280; margin-bottom: 1rem;">
                    Jumlah: ${restock.quantity} pcs
                </p>
            </div>`,
            () => {
                this.dm.deleteRestock(id);
                this.renderRestocks();
                this.renderStock();
                this.renderDashboard();
                this.showSuccessAlert('Restok berhasil dihapus!');
            }
        );
    }

    // Sales Rendering
    renderSales() {
        const tbody = document.getElementById('sales-tbody');
        const sales = this.dm.getAllSales();

        if (sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Belum ada transaksi penjualan</td></tr>';
            return;
        }

        tbody.innerHTML = sales.map((sale, index) => {
            const product = this.dm.getProduct(sale.productId);
            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${new Date(sale.date).toLocaleDateString('id-ID')}</td>
                    <td>${product ? product.name : 'Produk Dihapus'}</td>
                    <td>${sale.quantity}</td>
                    <td>${this.formatCurrency(sale.sellPrice)}</td>
                    <td>${this.formatCurrency(sale.revenue)}</td>
                    <td>${this.formatCurrency(sale.profit)}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-sale-btn" data-id="${sale.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-sale-btn" data-id="${sale.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        // Add event listeners
        tbody.querySelectorAll('.edit-sale-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.showSaleForm(id);
            });
        });

        tbody.querySelectorAll('.delete-sale-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.deleteSale(id);
            });
        });
    }

    showSaleForm(saleId = null) {
        const sale = saleId ? this.dm.getAllSales().find(s => s.id === saleId) : null;
        const title = sale ? 'Edit Penjualan' : 'Tambah Penjualan';
        const products = this.dm.getAllProducts();
        
        const formHTML = `
            <form id="sale-form">
                <div class="form-group">
                    <label>Tanggal *</label>
                    <input type="date" class="form-input" id="sale-date" value="${sale ? sale.date : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label>Produk *</label>
                    <select class="form-select" id="sale-product" required>
                        <option value="">Pilih Produk</option>
                        ${products.map(p => {
                            const stock = this.dm.getStockForProduct(p.id);
                            return `
                                <option value="${p.id}" data-stock="${stock.remaining}" ${sale && sale.productId === p.id ? 'selected' : ''}>
                                    ${p.name} (Stok: ${stock.remaining})
                                </option>
                            `;
                        }).join('')}
                    </select>
                </div>
                <div class="form-group" id="stock-display-group" style="background: #e0f2fe; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid #0284c7;">
                    <label style="color: #0c4a6e; font-weight: 600;">Stok Tersedia Sekarang</label>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #0c4a6e;" id="current-stock-display">
                        0 pcs
                    </div>
                    <small style="color: #0369a1;">Total stok yang ada sebelum penjualan ini</small>
                </div>
                <div class="form-group">
                    <label>Sisa di Showcase *</label>
                    <input type="number" class="form-input" id="sale-remaining" value="" required min="0">
                    <small style="color: #6b7280; font-size: 0.75rem;">Berapa yang masih tersisa di display/showcase?</small>
                </div>
                <div class="form-group" style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem;">
                    <label style="margin-bottom: 0.5rem;">Jumlah Terjual (Otomatis)</label>
                    <div style="font-size: 1.5rem; font-weight: 700; color: #059669;" id="calculated-sold">
                        0 pcs
                    </div>
                    <small style="color: #6b7280; font-size: 0.75rem;">Stok tersedia - Sisa di showcase</small>
                </div>
                <div class="form-actions">
                    <button type="button" class="btn" onclick="document.getElementById('modal').classList.remove('active')">Batal</button>
                    <button type="submit" class="btn btn-primary">Simpan</button>
                </div>
            </form>
        `;

        this.showModal(title, formHTML);

        // Auto calculate sold quantity
        const productSelect = document.getElementById('sale-product');
        const remainingInput = document.getElementById('sale-remaining');
        const soldDisplay = document.getElementById('calculated-sold');
        const stockDisplay = document.getElementById('current-stock-display');

        let currentStock = 0;

        const updateStockDisplay = () => {
            const selectedOption = productSelect.options[productSelect.selectedIndex];
            if (selectedOption.value) {
                currentStock = parseInt(selectedOption.dataset.stock) || 0;
                stockDisplay.textContent = currentStock + ' pcs';
                
                // If editing, pre-fill remaining based on current sale
                if (sale && sale.productId === selectedOption.value) {
                    const remainingValue = currentStock - sale.quantity;
                    remainingInput.value = remainingValue;
                }
            } else {
                currentStock = 0;
                stockDisplay.textContent = '0 pcs';
            }
            calculateSold();
        };

        const calculateSold = () => {
            const remaining = parseInt(remainingInput.value);
            if (isNaN(remaining) || remaining === '') {
                soldDisplay.textContent = '0 pcs';
                soldDisplay.style.color = '#6b7280';
                return;
            }
            
            const sold = Math.max(0, currentStock - remaining);
            soldDisplay.textContent = sold + ' pcs';
            soldDisplay.style.color = sold > 0 ? '#059669' : '#6b7280';
        };

        productSelect.addEventListener('change', updateStockDisplay);
        remainingInput.addEventListener('input', calculateSold);

        // Initialize
        updateStockDisplay();

        document.getElementById('sale-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const productId = document.getElementById('sale-product').value;
            const remaining = parseInt(document.getElementById('sale-remaining').value);
            
            if (isNaN(remaining)) {
                alert('Masukkan jumlah sisa di showcase yang valid.');
                return;
            }

            const sold = currentStock - remaining;

            if (sold <= 0) {
                alert('Jumlah terjual harus lebih dari 0. Pastikan sisa di showcase lebih kecil dari stok tersedia.');
                return;
            }

            if (remaining < 0) {
                alert('Sisa di showcase tidak boleh negatif.');
                return;
            }

            if (remaining > currentStock) {
                alert('Sisa di showcase tidak boleh lebih besar dari stok tersedia.');
                return;
            }

            const saleData = {
                date: document.getElementById('sale-date').value,
                productId: productId,
                quantity: sold
            };

            try {
                if (sale) {
                    this.dm.updateSale(saleId, saleData);
                } else {
                    this.dm.addSale(saleData);
                }

                document.getElementById('modal').classList.remove('active');
                this.renderSales();
                this.renderStock();
                this.renderDashboard();
            } catch (error) {
                alert(error.message);
            }
        });
    }

    deleteSale(id) {
        const sale = this.dm.getAllSales().find(s => s.id === id);
        const product = this.dm.getProduct(sale.productId);
        
        this.showConfirmModal(
            'Hapus Penjualan?',
            `<div style="text-align: center;">
                <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">⚠️</div>
                <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">
                    ${product ? product.name : 'Produk Dihapus'}
                </p>
                <p style="color: #6b7280; margin-bottom: 0.5rem;">
                    Tanggal: ${new Date(sale.date).toLocaleDateString('id-ID')}
                </p>
                <p style="color: #6b7280; margin-bottom: 1rem;">
                    Jumlah: ${sale.quantity} pcs
                </p>
            </div>`,
            () => {
                this.dm.deleteSale(id);
                this.renderSales();
                this.renderStock();
                this.renderDashboard();
                this.showSuccessAlert('Penjualan berhasil dihapus!');
            }
        );
    }

    // Stock Rendering
    renderStock() {
        const tbody = document.getElementById('stock-tbody');
        const products = this.dm.getAllProducts();

        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Belum ada data stok</td></tr>';
            return;
        }

        tbody.innerHTML = products.map((product, index) => {
            const stock = this.dm.getStockForProduct(product.id);
            let statusClass = 'badge-success';
            let statusText = 'Aman';
            
            if (stock.remaining === 0) {
                statusClass = 'badge-danger';
                statusText = 'Habis';
            } else if (stock.remaining < 10) {
                statusClass = 'badge-warning';
                statusText = 'Menipis';
            }

            return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${this.formatCurrency(product.sellPrice)}</td>
                    <td>${stock.totalRestock}</td>
                    <td>${stock.totalSold}</td>
                    <td>${stock.remaining}</td>
                    <td><span class="badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        }).join('');
    }

    // Reports Rendering
    renderReports() {
        // Set default dates
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        document.getElementById('filter-start-date').value = startDate.toISOString().split('T')[0];
        document.getElementById('filter-end-date').value = endDate.toISOString().split('T')[0];

        this.filterReport();
    }

    filterReport() {
        const startDate = document.getElementById('filter-start-date').value;
        const endDate = document.getElementById('filter-end-date').value;

        if (!startDate || !endDate) {
            alert('Pilih tanggal mulai dan akhir');
            return;
        }

        const report = this.dm.getReportByDateRange(startDate, endDate);

        // Update summary
        document.getElementById('report-revenue').textContent = this.formatCurrency(report.summary.totalRevenue);
        document.getElementById('report-profit').textContent = this.formatCurrency(report.summary.totalProfit);
        document.getElementById('report-capital').textContent = this.formatCurrency(report.summary.totalCost);
        document.getElementById('report-margin').textContent = report.summary.profitMargin.toFixed(2) + '%';

        // Update table
        const tbody = document.getElementById('report-tbody');
        
        if (report.items.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Tidak ada data untuk periode ini</td></tr>';
            return;
        }

        tbody.innerHTML = report.items.map(item => {
            const margin = item.revenue > 0 ? (item.profit / item.revenue * 100) : 0;
            return `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.totalSold}</td>
                    <td>${this.formatCurrency(item.revenue)}</td>
                    <td>${this.formatCurrency(item.cost)}</td>
                    <td>${this.formatCurrency(item.profit)}</td>
                    <td>${margin.toFixed(2)}%</td>
                </tr>
            `;
        }).join('');
    }

    exportToExcel() {
        const startDate = document.getElementById('filter-start-date').value;
        const endDate = document.getElementById('filter-end-date').value;

        if (!startDate || !endDate) {
            alert('Pilih periode laporan terlebih dahulu');
            return;
        }

        const report = this.dm.getReportByDateRange(startDate, endDate);
        
        // Create CSV content
        let csv = 'Laporan Penjualan\n';
        csv += `Periode: ${new Date(startDate).toLocaleDateString('id-ID')} - ${new Date(endDate).toLocaleDateString('id-ID')}\n\n`;
        csv += 'Nama Produk,Total Terjual,Pendapatan,Modal,Keuntungan,Margin (%)\n';
        
        report.items.forEach(item => {
            const margin = item.revenue > 0 ? (item.profit / item.revenue * 100) : 0;
            csv += `${item.productName},${item.totalSold},${item.revenue},${item.cost},${item.profit},${margin.toFixed(2)}\n`;
        });

        csv += '\nRingkasan\n';
        csv += `Total Pendapatan,${report.summary.totalRevenue}\n`;
        csv += `Total Modal,${report.summary.totalCost}\n`;
        csv += `Total Keuntungan,${report.summary.totalProfit}\n`;
        csv += `Margin Profit,${report.summary.profitMargin.toFixed(2)}%\n`;

        // Download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `laporan_${startDate}_${endDate}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal').classList.add('active');
    }

    showConfirmModal(title, message, onConfirm, onCancel = null, isLogout = false) {
        const content = `
            <div style="margin-bottom: 1.5rem;">
                ${message}
            </div>
            <div class="form-actions">
                <button type="button" class="btn" id="cancel-confirm-btn">
                    <i class="fas fa-times"></i> Batal
                </button>
                <button type="button" class="btn ${isLogout ? 'btn-primary' : 'btn-danger'}" id="ok-confirm-btn">
                    <i class="fas fa-${isLogout ? 'sign-out-alt' : 'trash'}"></i> ${isLogout ? 'Ya, Logout' : 'Hapus'}
                </button>
            </div>
        `;
        
        this.showModal(title, content);
        
        document.getElementById('ok-confirm-btn').addEventListener('click', () => {
            document.getElementById('modal').classList.remove('active');
            if (onConfirm) onConfirm();
        });
        
        document.getElementById('cancel-confirm-btn').addEventListener('click', () => {
            document.getElementById('modal').classList.remove('active');
            if (onCancel) onCancel();
        });
    }

    showSuccessAlert(message) {
        const content = `
            <div style="text-align: center;">
                <div style="font-size: 4rem; color: #10b981; margin-bottom: 1rem;">✅</div>
                <p style="font-size: 1.125rem; font-weight: 600;">${message}</p>
            </div>
            <div class="form-actions" style="justify-content: center; margin-top: 1.5rem;">
                <button type="button" class="btn btn-success" id="close-alert-btn">
                    <i class="fas fa-check"></i> OK
                </button>
            </div>
        `;
        
        this.showModal('Berhasil', content);
        
        document.getElementById('close-alert-btn').addEventListener('click', () => {
            document.getElementById('modal').classList.remove('active');
        });
    }

    async resetAllData() {
        this.showConfirmModal(
            'Reset Semua Data?',
            `<div style="text-align: center;">
                <div style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;">⚠️</div>
                <p style="font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; color: #ef4444;">
                    PERINGATAN!
                </p>
                <p style="color: #6b7280; margin-bottom: 0.5rem;">
                    Ini akan menghapus SEMUA data:
                </p>
                <ul style="color: #6b7280; text-align: left; margin: 1rem auto; max-width: 300px;">
                    <li>✖️ Semua Produk</li>
                    <li>✖️ Semua Restok</li>
                    <li>✖️ Semua Penjualan</li>
                    <li>✖️ Semua Stok</li>
                </ul>
                <p style="color: #ef4444; font-weight: 600; margin-top: 1rem;">
                    Data tidak bisa dikembalikan!
                </p>
            </div>`,
            async () => {
                showLoading(true);
                console.log('🗑️ Resetting all data...');
                
                try {
                    const success = await firebaseService.clearAllData();
                    
                    if (success) {
                        console.log('✅ All data cleared from Firebase');
                        this.showSuccessAlert('✅ Semua data berhasil dihapus!');
                        
                        // Refresh page to reload empty data
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    } else {
                        console.error('❌ Failed to clear data');
                        alert('❌ Gagal menghapus data. Coba lagi.');
                        showLoading(false);
                    }
                } catch (error) {
                    console.error('❌ Error clearing data:', error);
                    alert('❌ Error: ' + error.message);
                    showLoading(false);
                }
            }
        );
    }

    renderSettings() {
        // Setup change password form
        const form = document.getElementById('change-password-form');
        
        // Remove previous event listeners
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);
        
        document.getElementById('change-password-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const oldPassword = document.getElementById('old-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword !== confirmPassword) {
                alert('❌ Password baru dan konfirmasi tidak cocok!');
                return;
            }
            
            if (newPassword.length < 6) {
                alert('❌ Password minimal 6 karakter!');
                return;
            }
            
            if (auth.changePassword(oldPassword, newPassword)) {
                this.showSuccessAlert('Password berhasil diubah!');
                document.getElementById('change-password-form').reset();
            } else {
                alert('❌ Password lama salah!');
            }
        });
    }
}

// ============================================
// Initialize Application with Firebase
// ============================================

const auth = new AuthManager(firebaseService);
const dm = new DataManager(firebaseService);
let ui = null;

// Show loading
function showLoading(show = true) {
    const loginPage = document.getElementById('login-page');
    if (show) {
        loginPage.style.opacity = '0.6';
        loginPage.style.pointerEvents = 'none';
    } else {
        loginPage.style.opacity = '1';
        loginPage.style.pointerEvents = 'auto';
    }
}

// Initialize app after login
async function initializeApp() {
    // Initialize DataManager and load data
    await dm.init();
    
    // Initialize UI
    ui = new UIManager(dm);
    
    // Note: Demo data auto-load has been disabled
    // Users should manually add products via "Tambah Produk" button
    // If you want to restore demo data, uncomment the code below:
    /*
    if (dm.getAllProducts().length === 0) {
        const sampleProducts = [
            { name: 'Nipis Madu', sellPrice: 5000 },
            { name: 'Air Mineral', sellPrice: 3000 },
            { name: 'Fruit Tea', sellPrice: 4000 },
            { name: 'Teh Pucuk', sellPrice: 4000 },
            { name: 'Teh Kotak', sellPrice: 4500 }
        ];
        
        for (const p of sampleProducts) {
            await dm.addProduct(p);
        }
        
        ui.renderProducts();
        ui.renderDashboard();
    }
    */
}

// Login Handler
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    console.log('🔐 Login attempt for:', email);
    showLoading(true);
    
    try {
        const success = await auth.login(email, password);
        console.log('✅ Login result:', success);
        
        if (success) {
            console.log('✅ Login successful, waiting for onAuthStateChanged...');
            // Don't navigate here - let onAuthStateChanged handle it
        } else {
            showLoading(false);
            console.error('❌ Login failed');
            alert('❌ Login gagal! Periksa email dan password Anda.');
        }
    } catch (error) {
        showLoading(false);
        console.error('❌ Login error:', error);
        
        // User-friendly error messages
        let errorMsg = '❌ Error: ';
        if (error.code === 'auth/too-many-requests') {
            errorMsg += 'Terlalu banyak percobaan login. Tunggu 15 menit atau gunakan email lain untuk test.';
        } else if (error.code === 'auth/configuration-not-found') {
            errorMsg += 'Firebase Authentication belum diaktifkan! Buka Firebase Console → Authentication → Get Started';
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMsg += 'Email/Password provider belum enabled! Buka Firebase Console → Authentication → Sign-in method → Enable Email/Password';
        } else if (error.code === 'auth/wrong-password') {
            errorMsg += 'Password salah!';
        } else if (error.code === 'auth/invalid-credential') {
            errorMsg += 'Email atau password salah! Untuk testing, gunakan email baru (akan auto-create user).';
        } else if (error.code === 'auth/invalid-email') {
            errorMsg += 'Format email tidak valid!';
        } else if (error.code === 'auth/email-already-in-use') {
            errorMsg += 'Email sudah terdaftar dengan password berbeda!';
        } else if (error.code === 'auth/network-request-failed') {
            errorMsg += 'Tidak ada koneksi internet!';
        } else {
            errorMsg += error.message;
        }
        
        alert(errorMsg);
    }
});

// Check if already logged in (Firebase auth persistence)
let isInitializing = false;

// Set timeout untuk loading screen - jika > 5 detik, force show login
const loadingTimeout = setTimeout(() => {
    const loadingEl = document.getElementById('initial-loading');
    if (loadingEl && loadingEl.style.display !== 'none') {
        console.warn('⚠️ Loading timeout (5s) - forcing login page display');
        console.warn('⚠️ This usually means: slow internet or Firebase connection issue');
        loadingEl.style.display = 'none';
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
    }
}, 5000); // 5 seconds timeout (lebih cepat untuk better UX)

console.log('⏳ Waiting for Firebase auth state...');

firebase.auth().onAuthStateChanged(async (user) => {
    console.log('🔄 Auth state changed:', user ? user.email : 'No user');
    clearTimeout(loadingTimeout); // Cancel timeout jika sudah dapat response
    
    if (user && !ui && !isInitializing) {
        // User is logged in
        isInitializing = true;
        console.log('✅ User logged in, initializing app...');
        
        try {
            // Hide initial loading screen
            document.getElementById('initial-loading').style.display = 'none';
            document.getElementById('login-page').style.display = 'none';
            document.getElementById('main-app').style.display = 'flex';
            
            await initializeApp();
            showLoading(false);
            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ Error initializing app:', error);
            alert('❌ Error loading app: ' + error.message);
            showLoading(false);
        } finally {
            isInitializing = false;
        }
    } else if (!user) {
        // User is not logged in
        console.log('❌ No user, showing login page');
        
        // Hide initial loading, show login
        document.getElementById('initial-loading').style.display = 'none';
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('main-app').style.display = 'none';
        showLoading(false);
    }
});
