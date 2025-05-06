/**
 * Documentation
 * Promotion Service
 * This service applies various promotion Formulas to a shopping cart.
 * 
 * author: Josue T
 * date: 2025-May-04
 * 
 * Installation and How To Run This File:
 * Step-by-Step: Run the TypeScript File

1. Make sure Node.js is installed
-----------------------------------
If not installed, download and install it from https://nodejs.org

Then run the following 2 line to verify if Node.js and npm are installed:
node -v
npm -v
If you see the version numbers, you're good to go!

2. Install TypeScript globally (optional)
-------------------------------------------
2.2 Initialize your project (if needed)

mkdir promotion-service
cd promotion-service
npm init -y

3. Install TypeScript and ts-node
----------------------------------
npm install typescript ts-node @types/node --save-dev


4. Create a TypeScript config file
------------------------------------
npx tsc --init
You can accept defaults or edit tsconfig.json later for strictness.

5. Create the file
-----------------------
Save the TypeScript code in a file called:

promotionService.ts
6. Run it with ts-node
-------------------------------
npx ts-node promotionService.ts
ou should see output like:

{ total: 250, discount: 55, final: 195 }

 */
  
  type Cart = {
    items: CartItem[];
    promoCode?: string;
  };

type CartItem = {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  };
  
  interface PromotionFormula {
    process(cart: Cart): number;
  }
  
  /**
   * CartTotalFormula applies a percentage discount to the total cart value
   * if the total exceeds a specified threshold.
   * author: Josue T
   * date: 2025-May-04
   * description: This Formula checks if the total cart value exceeds a threshold
   * and applies a percentage discount if it does.
   * @constructor
   * @param {number} threshold - The minimum cart total to process the discount.
   * @param {number} discountPercent - The percentage discount to process.
   * @returns {number} - The discount amount.
   * @example
   * const Formula = new CartTotalFormula(150, 5);
   * const discount = Formula.process(cart);
   * console.log(discount); // Outputs the discount amount based on the cart total.
   * example: "5% off if cart >= $150"
   */
  class CartTotalFormula implements PromotionFormula {
    constructor(private threshold: number, private discountPercent: number) {}
  
    process(cart: Cart): number {
      const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return total >= this.threshold ? total * (this.discountPercent / 100) : 0;
    }
  }
  
  /**
   * ProductFormula applies a fixed discount to a specific product in the cart.
   *  author: Josue T
   * date: 2025-May-04
   * description: This Formula checks if a specific product is in the cart
   * and applies a fixed discount for each unit of that product.
   * @constructor
   * @param {string} productId - The ID of the product to process the discount to.
   * @param {number} fixedDiscount - The fixed discount amount per unit.
   * @returns {number} - The total discount amount for the specified product.
   * @example
   * const Formula = new ProductFormula('A1', 10);
   * const discount = Formula.process(cart);
   * console.log(discount); // Outputs the discount amount based on the product quantity.
   * example: "$10 off per Shoes item"
   */
  class ProductFormula implements PromotionFormula {
    constructor(private productId: string, private fixedDiscount: number) {}
  
    process(cart: Cart): number {
      const item = cart.items.find(item => item.productId === this.productId);
      return item ? this.fixedDiscount * item.quantity : 0;
    }
  }
  
  // --- Formula: Promo Code Discount (e.g., VIP20 = 20% off)
  /**
   * PromoCodeFormula applies a percentage discount based on a promo code.
   *   author: Josue T
   * date: 2025-May-04
   * description: This Formula checks if a valid promo code is applied
   * and applies a percentage discount based on the code.
   * @constructor
   * @param {string} promoCode - The promo code to process the discount.
   * @param {number} discountPercent - The percentage discount to process.
   * @returns {number} - The discount amount based on the promo code.
   * @example
   * const Formula = new PromoCodeFormula('SUMMER10', 10);
   * const discount = Formula.process(cart);
   * console.log(discount); // Outputs the discount amount based on the promo code.
   * example: "SUMMER10 = 10% off"
   */
  class PromoCodeFormula implements PromotionFormula {
    private promoCodes: Record<string, number> = {
      'SUMMER10': 10,
      'VIP20': 20,
    };
  
    process(cart: Cart): number {
      const percent = this.promoCodes[cart.promoCode || ''] || 0;
      const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return total * (percent / 100);
    }
  }
  
  /** Promotion Processor: process all Formulas and return results */
  /**
   * PromotionProcessor applies all promotion Formulas to a shopping cart
   * and calculates the total, discount, and final amount.
   * author: Josue T
   * date: 2025-May-04
   * description: This class processes the cart and applies all promotion Formulas
   * to calculate the total, discount, and final amount.
   * @constructor
   * @param {PromotionFormula[]} Formulas - An array of promotion Formulas to process.
   * @returns {number} - The total discount amount.
   * @example
   * const processor = new PromotionProcessor([Formula1, Formula2]);
   * const result = processor.processDiscount(cart);
   * console.log(result); // Outputs the total, discount, and final amount.
   * example: "process all Formulas and return results"
   * @example
   * const processor = new PromotionProcessor([new CartTotalFormula(150, 5), new ProductFormula('A1', 10)]);
   * const result = processor.processDiscount(cart);
   * console.log(result); // Outputs the total, discount, and final amount.
   */
  class PromotionProcessor {
    constructor(private Formulas: PromotionFormula[]) {}
  
    discountCalculation(cart: Cart): number {
      return this.Formulas.reduce((sum, Formula) => sum + Formula.process(cart), 0);
    }
  
    processDiscount(cart: Cart): { total: number; discount: number; final: number } {
      const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const discount = this.discountCalculation(cart);
      return {
        total,
        discount,
        final: total - discount,
      };
    }
  }
  
 
  
  /**
   * Let now pass to our Cart Service some fake json data from the imaginary product service
   * and process the promotion Formulas to it.
   */
  const cart: Cart = {
    items: [
      { productId: 'A1', name: 'Shoes', price: 100, quantity: 2 },
      { productId: 'B2', name: 'Hat', price: 50, quantity: 1 },
    ],
    promoCode: 'VIP20',
  };
  
  const Formulas: PromotionFormula[] = [
    new CartTotalFormula(150, 5),       // 5% off if total >= $150
    new ProductFormula('A1', 10),       // $10 off per "Shoes"
    new PromoCodeFormula(),             // VIP20 = 20% off
  ];
  
  const engine = new PromotionProcessor(Formulas);
  const result = engine.processDiscount(cart);
  
  console.log(result);
  // Example output: { total: 250, discount: 55, final: 195 }
  