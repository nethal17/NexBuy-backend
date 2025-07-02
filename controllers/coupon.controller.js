import Coupon from '../models/coupon.model.js';

export const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({userId:req.user._id, isActive: true});
        res.status(200).json(coupon || null);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found or inactive' });
        }

        const currentDate = new Date();
        if (coupon.expirationDate < currentDate) {
            coupon.isActive = false; // Mark as inactive if expired
            await coupon.save();
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        })
        
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};
