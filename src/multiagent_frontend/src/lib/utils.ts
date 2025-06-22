import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a BigInt value to a more readable string representation
 */
export function formatBigInt(value: bigint, decimals = 0): string {
  if (value === 0n) return "0";
  
  const valueStr = value.toString();
  
  if (decimals === 0) {
    // Add thousand separators
    return valueStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  // If there are decimals, insert the decimal point
  if (valueStr.length <= decimals) {
    // Pad with leading zeros if needed
    const padding = "0".repeat(decimals - valueStr.length + 1);
    return `0.${padding}${valueStr}`.replace(/\.?0+$/, "");
  }
  
  const intPart = valueStr.slice(0, valueStr.length - decimals);
  const decPart = valueStr.slice(valueStr.length - decimals);
  
  return `${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${decPart}`.replace(/\.?0+$/, "");
}

/**
 * Shortens an address or Principal ID for display
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

/**
 * Generates a random color based on a string
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ("00" + value.toString(16)).substr(-2);
  }
  
  return color;
}

/**
 * Formats a date string or timestamp to a human-readable format
 */
export function formatDate(date: string | number | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Converts a number to a percentage string
 */
export function toPercentage(value: number, decimalPlaces = 1): string {
  return `${value.toFixed(decimalPlaces)}%`;
}