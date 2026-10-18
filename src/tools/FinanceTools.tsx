import React, { useState, useMemo } from 'react';
import { QuickCopy } from '../components/QuickCopy';
import { DollarSign, Percent, TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface FinanceToolsProps {
  mode?: string;
}

export const FinanceTools: React.FC<FinanceToolsProps> = ({ mode = 'simple-interest' }) => {
  const [val1, setVal1] = useState<number>(1000);
  const [val2, setVal2] = useState<number>(5);
  const [val3, setVal3] = useState<number>(3);
  const [val4, setVal4] = useState<number>(0);

  const data = useMemo(() => {
    switch (mode) {
      case 'simple-interest': {
        const p = val1;
        const r = val2 / 100;
        const t = val3;
        const interest = p * r * t;
        const total = p + interest;
        return {
          title: 'Simple Interest (I = P · r · t)',
          items: [
            { label: 'Total Interest Accrued', val: `$${interest.toFixed(2)}` },
            { label: 'Final Total Balance (P + I)', val: `$${total.toFixed(2)}` }
          ]
        };
      }
      case 'discount': {
        const originalPrice = val1;
        const discountPct = val2;
        const savings = (originalPrice * discountPct) / 100;
        const finalPrice = originalPrice - savings;
        return {
          title: `Discount Calculator (${discountPct}% Off)`,
          items: [
            { label: 'You Save (Discount Amount)', val: `$${savings.toFixed(2)}` },
            { label: 'Final Sale Price', val: `$${finalPrice.toFixed(2)}` }
          ]
        };
      }
      case 'sales-tax': {
        const amount = val1;
        const taxRate = val2;
        const tax = (amount * taxRate) / 100;
        const total = amount + tax;
        return {
          title: `Sales Tax / VAT (${taxRate}%)`,
          items: [
            { label: 'Tax Amount Added', val: `$${tax.toFixed(2)}` },
            { label: 'Total Price with Tax', val: `$${total.toFixed(2)}` },
            { label: 'Base if price already included tax', val: `$${(amount / (1 + taxRate / 100)).toFixed(2)}` }
          ]
        };
      }
      case 'margin-markup': {
        const cost = val1;
        const price = val2;
        const profit = price - cost;
        const marginPct = price !== 0 ? (profit / price) * 100 : 0;
        const markupPct = cost !== 0 ? (profit / cost) * 100 : 0;
        return {
          title: 'Profit Margin & Markup',
          items: [
            { label: 'Gross Profit ($)', val: `$${profit.toFixed(2)}` },
            { label: 'Profit Margin (%)', val: `${marginPct.toFixed(2)}%` },
            { label: 'Markup Percentage (%)', val: `${markupPct.toFixed(2)}%` }
          ]
        };
      }
      case 'break-even': {
        const fixedCosts = val1;
        const pricePerUnit = val2;
        const variableCostPerUnit = val3;
        const contributionMargin = pricePerUnit - variableCostPerUnit;
        const breakEvenUnits = contributionMargin > 0 ? fixedCosts / contributionMargin : 0;
        const breakEvenRevenue = breakEvenUnits * pricePerUnit;
        return {
          title: 'Break-Even Analysis',
          items: [
            { label: 'Contribution Margin per Unit', val: `$${contributionMargin.toFixed(2)}` },
            { label: 'Break-Even Units Required', val: `${Math.ceil(breakEvenUnits)} units` },
            { label: 'Break-Even Revenue ($)', val: `$${breakEvenRevenue.toFixed(2)}` }
          ]
        };
      }
      case 'roi': {
        const initial = val1;
        const returned = val2;
        const gain = returned - initial;
        const roi = initial !== 0 ? (gain / initial) * 100 : 0;
        return {
          title: 'Return on Investment (ROI)',
          items: [
            { label: 'Net Gain ($)', val: `$${gain.toFixed(2)}` },
            { label: 'ROI Percentage (%)', val: `${roi.toFixed(2)}%` }
          ]
        };
      }
      case 'inflation': {
        const presentAmount = val1;
        const inflationRate = val2 / 100;
        const years = val3;
        const futureEquivalent = presentAmount * Math.pow(1 + inflationRate, years);
        const erodedPurchasingPower = presentAmount / Math.pow(1 + inflationRate, years);
        return {
          title: `Inflation Impact over ${years} Years at ${val2}%`,
          items: [
            { label: 'Future Cost of Same Basket ($)', val: `$${futureEquivalent.toFixed(2)}` },
            { label: 'Future Purchasing Power of Current $', val: `$${erodedPurchasingPower.toFixed(2)}` }
          ]
        };
      }
      case 'salary-hourly': {
        const salary = val1;
        const hoursPerWeek = val2 || 40;
        const weeksPerYear = val3 || 52;
        const totalHours = hoursPerWeek * weeksPerYear;
        const hourlyRate = totalHours > 0 ? salary / totalHours : 0;
        const monthly = salary / 12;
        const biweekly = salary / 26;
        return {
          title: `Salary ($${salary.toLocaleString()}) to Wage Breakdown`,
          items: [
            { label: 'Equivalent Hourly Wage', val: `$${hourlyRate.toFixed(2)} / hr` },
            { label: 'Monthly Gross Pay', val: `$${monthly.toFixed(2)}` },
            { label: 'Bi-Weekly Paycheck', val: `$${biweekly.toFixed(2)}` }
          ]
        };
      }
      case 'unit-price': {
        const priceA = val1;
        const qtyA = val2 || 1;
        const priceB = val3;
        const qtyB = val4 || 1;
        const unitA = priceA / qtyA;
        const unitB = priceB / qtyB;
        const cheaper = unitA < unitB ? 'Option A is cheaper!' : unitB < unitA ? 'Option B is cheaper!' : 'Both options have identical unit cost.';
        return {
          title: 'Unit Price Value Comparison',
          items: [
            { label: 'Option A Unit Price', val: `$${unitA.toFixed(4)} per unit` },
            { label: 'Option B Unit Price', val: `$${unitB.toFixed(4)} per unit` },
            { label: 'Best Value Verdict', val: cheaper }
          ]
        };
      }
      case 'fuel-trip': {
        const distanceMiles = val1;
        const mpg = val2 || 25;
        const gasPrice = val3 || 3.50;
        const gallons = distanceMiles / mpg;
        const totalCost = gallons * gasPrice;
        return {
          title: `Trip Fuel Estimate (${distanceMiles} miles)`,
          items: [
            { label: 'Estimated Fuel Needed', val: `${gallons.toFixed(2)} gallons` },
            { label: 'Total Trip Fuel Cost', val: `$${totalCost.toFixed(2)}` }
          ]
        };
      }
      case 'rule-of-72': {
        const rate = val1 || 7;
        const yearsToDouble = 72 / rate;
        return {
          title: 'Rule of 72 Doubling Time',
          items: [
            { label: `Years to double money at ${rate}% annual return`, val: `${yearsToDouble.toFixed(1)} years` }
          ]
        };
      }
      case 'emergency-fund': {
        const monthlyExpense = val1;
        return {
          title: `Emergency Fund Recommendation`,
          items: [
            { label: '3-Month Safety Net', val: `$${(monthlyExpense * 3).toLocaleString()}` },
            { label: '6-Month Prudent Reserve', val: `$${(monthlyExpense * 6).toLocaleString()}` },
            { label: '9-Month Conservative Cushion', val: `$${(monthlyExpense * 9).toLocaleString()}` }
          ]
        };
      }
      case 'budget-50-30-20': {
        const income = val1;
        return {
          title: '50/30/20 Monthly Budget Allocation',
          items: [
            { label: '50% Needs (Rent, food, utilities, health)', val: `$${(income * 0.5).toFixed(2)}` },
            { label: '30% Wants (Dining out, entertainment, shopping)', val: `$${(income * 0.3).toFixed(2)}` },
            { label: '20% Savings (Debts, retirement, emergency fund)', val: `$${(income * 0.2).toFixed(2)}` }
          ]
        };
      }
      default:
        return {
          title: 'Financial Result',
          items: [{ label: 'Result', val: `$${(val1 * (1 + val2 / 100)).toFixed(2)}` }]
        };
    }
  }, [mode, val1, val2, val3, val4]);

  return (
    <div className="space-y-6">
      {/* Inputs Form */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">
              {mode === 'discount' ? 'Original Price ($)' : mode === 'salary-hourly' ? 'Annual Salary ($)' : mode === 'emergency-fund' || mode === 'budget-50-30-20' ? 'Monthly Amount ($)' : mode === 'unit-price' ? 'Option A Price ($)' : mode === 'fuel-trip' ? 'Distance (Miles)' : mode === 'rule-of-72' ? 'Annual Return Rate (%)' : 'Amount / Principal ($)'}:
            </label>
            <input
              type="number"
              value={val1}
              onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
            />
          </div>

          {mode !== 'emergency-fund' && mode !== 'budget-50-30-20' && mode !== 'rule-of-72' && (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                {mode === 'discount' ? 'Discount Percentage (%)' : mode === 'sales-tax' ? 'Tax Rate (%)' : mode === 'margin-markup' ? 'Selling Price ($)' : mode === 'salary-hourly' ? 'Weekly Hours' : mode === 'unit-price' ? 'Option A Quantity' : mode === 'fuel-trip' ? 'Vehicle MPG' : 'Interest Rate (%)'}:
              </label>
              <input
                type="number"
                value={val2}
                onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
              />
            </div>
          )}

          {(mode === 'simple-interest' || mode === 'break-even' || mode === 'inflation' || mode === 'unit-price' || mode === 'fuel-trip') && (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                {mode === 'unit-price' ? 'Option B Price ($)' : mode === 'fuel-trip' ? 'Gas Price per Gallon ($)' : 'Time (Years)'}:
              </label>
              <input
                type="number"
                value={val3}
                onChange={(e) => setVal3(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
              />
            </div>
          )}

          {mode === 'unit-price' && (
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Option B Quantity:</label>
              <input
                type="number"
                value={val4}
                onChange={(e) => setVal4(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-base font-bold text-slate-900 dark:text-white"
              />
            </div>
          )}
        </div>
      </div>

      {/* Results Cards */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
          {data.title}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.items.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between"
            >
              <div>
                <span className="text-xs text-slate-500 block">{item.label}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5 block">
                  {item.val}
                </span>
              </div>
              <QuickCopy text={item.val} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
