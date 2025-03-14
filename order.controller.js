import cartModel from "../../../../DB/models/cart.model.js";
import orderModel from "../../../../DB/models/order.model.js";
import productModel from "../../../../DB/models/product.model.js";
import financialRecordModel from "../../../../DB/models/financialRecordModel.js";
import mongoose from "mongoose";

export const addToCart = async (req, res) => {
    try {
        const { quantity } = req.body; 
        const { productId } = req.params;
        const userId = req.user._id;

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "المنتج غير موجود" });
        }

        let cart = await cartModel.findOne({ userId });

        if (!cart) {
            cart = new cartModel({ userId, products: [], totalPrice: 0 });
        }

        const existingProductIndex = cart.products.findIndex((item) => item.productId.toString() === productId.toString());
        let newQuantity = quantity;

        if (existingProductIndex > -1) {
            newQuantity = cart.products[existingProductIndex].quantity + quantity;
        }

        
        if (newQuantity > product.quantity) {
            return res.status(400).json({ message: `لا يمكنك إضافة أكثر من ${product.quantity} وحدة من هذا المنتج` });
        }

        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity = newQuantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        cart.totalPrice = cart.products.reduce((acc, item) => acc + item.quantity * product.price, 0);

        await cart.save();
        res.status(200).json({ message: "تمت إضافة المنتج إلى السلة", cart });
    } catch (error) {
        res.status(500).json({ message: `خطأ: ${error.message}` });
    }
};

         
        export const removeFromCart = async (req, res) => {
            try {
                const { productId } = req.params;
                const userId = req.user.id;
        
                let cart = await cartModel.findOne({ userId });
                if (!cart) {
                    return res.status(404).json({ message: "السلة غير موجودة" });
                }
                const product=await productModel.findById(productId)
        
                cart.products = cart.products.filter((item) => item.productId.toString() !== productId);
        
                cart.totalPrice = cart.products.reduce((acc, item) => acc + item.quantity * product.price, 0);
        
                await cart.save();
                res.status(200).json({ message: "تمت إزالة المنتج من السلة", cart });
            } catch (error) {
                res.status(500).json({ message: `خطأ: ${error.message}` });
            }
        };
        export const getCart = async (req, res) => {
            try {
                const userId = req.user.id;
                const cart = await cartModel.findOne({ userId })
                    .populate("products.productId"); 
        
                if (!cart) {
                    return res.status(404).json({ message: "السلة فارغة" });
                }
        
                res.status(200).json({ cart });
            } catch (error) {
                res.status(500).json({ message: `خطأ: ${error.message}` });
            }
        };

        export const checkout = async (req, res) => {
            try {
                const userId = req.user._id;
                const cart = await cartModel.findOne({ userId });
        
                if (!cart || cart.products.length === 0) {
                    return res.status(400).json({ message: "السلة فارغة" });
                }
        
                const user = await userModel.findById(userId);
                if (!user) {
                    return res.status(404).json({ message: "المستخدم غير موجود" });
                }
        
               
                if (user.balance < cart.totalPrice) {
                    return res.status(400).json({ message: "الرصيد غير كافٍ لإتمام الشراء" });
                }
        
          
                user.balance -= cart.totalPrice;
                await user.save();
        
               
                await financialRecordModel.create({
                    userId,
                    type: "debit", 
                    amount: cart.totalPrice,
                    description: "شراء منتجات",
                    balanceAfterTransaction: user.balance
                });
        
                
                const newOrder = new orderModel({
                    userId,
                    products: cart.products,
                    totalPrice: cart.totalPrice
                });
        
                await newOrder.save();
                await cartModel.findOneAndDelete({ userId });
        
                res.status(200).json({ message: "تم إتمام الطلب بنجاح", order: newOrder, balance: user.balance });
            } catch (error) {
                res.status(500).json({ message: `خطأ: ${error.message}` });
            }
        };
        

