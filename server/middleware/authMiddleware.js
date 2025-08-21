import jwt from "jsonwebtoken";
import Company from "../models/Company.js";
import User from "../models/User.js";

// Helper function to detect token type
const isClerkToken = (token) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    return decoded?.payload?.iss?.includes('clerk.accounts') || 
           decoded?.header?.alg === 'RS256';
  } catch {
    return false;
  }
};

// Middleware for company authentication (unchanged)
export const protectCompany = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.startsWith('Bearer ') 
      ? req.headers.authorization.split(" ")[1] 
      : req.headers.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, { 
      algorithms: ["HS256"] 
    });
    
    const company = await Company.findById(decoded.id).select("-password");
    if (!company) {
      return res.status(404).json({ 
        success: false, 
        message: "Company not found" 
      });
    }

    req.company = company;
    next();
  } catch (error) {
    console.error("Company authentication error:", error);
    res.status(401).json({ 
      success: false, 
      message: "Authentication failed" 
    });
  }
};

// Main authentication middleware
export const authenticateUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.startsWith('Bearer ') 
      ? req.headers.authorization.split(" ")[1] 
      : req.headers.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Access denied. No token provided." 
      });
    }

    console.log("Received token in middleware");

    // Check if it's a Clerk token
    if (isClerkToken(token)) {
      console.log("Processing Clerk token");
      
      try {
        // For development: decode without verification (NOT RECOMMENDED FOR PRODUCTION)
        const decoded = jwt.decode(token, { complete: true });
        
        if (!decoded?.payload) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid token format" 
          });
        }

        const payload = decoded.payload;
        console.log("Decoded Clerk payload:", payload);
        
        // Check expiration
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          return res.status(401).json({ 
            success: false, 
            message: "Token has expired" 
          });
        }

        // Check if token is not yet valid
        if (payload.nbf && payload.nbf > currentTime) {
          return res.status(401).json({ 
            success: false, 
            message: "Token not yet valid" 
          });
        }

        // Validate required claims
        if (!payload.sub) {
          return res.status(401).json({ 
            success: false, 
            message: "Invalid token: missing user ID" 
          });
        }

        // Create user object from Clerk token
        req.user = {
          id: payload.sub,
          clerkId: payload.sub,
          sessionId: payload.sid,
          isClerkUser: true,
          issuer: payload.iss
        };

        console.log("Authenticated Clerk user:", req.user.id);
        next();
        
      } catch (clerkError) {
        console.error("Clerk token processing error:", clerkError);
        return res.status(401).json({ 
          success: false, 
          message: "Invalid Clerk token" 
        });
      }
    } else {
      console.log("Processing custom token");
      
      // Handle custom JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { 
        algorithms: ["HS256"] 
      });
      
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }

      req.user = user;
      console.log("Authenticated custom user:", user.id);
      next();
    }
  } catch (error) {
    console.error("Authentication error:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: "Token has expired" 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid token" 
      });
    }
    
    res.status(401).json({ 
      success: false, 
      message: "Authentication failed" 
    });
  }
};