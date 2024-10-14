import type { TagColor } from "~/types/tags";

export const generateTagStyling = (tagKey: number): TagColor => {
  switch (tagKey) {
    case 2:
      return {
        color: 'rgba(220, 38, 38, 0.2)',
        textColor: '#f87171',
        borderColor: '#ef4444',
      };
    case 3:
      return {
        color: 'rgba(234, 88, 12, 0.2)',
        textColor: '#f97316',
        borderColor: 'orange',
      };
    case 4:
      return {
        color: 'rgba(202, 138, 4, 0.2)',
        textColor: '#eab308',
        borderColor: '#facc15',
      };
    case 5:
      return {
        color: 'rgb(37, 99, 235, 0.2)',
        textColor: '#60a5fa',
        borderColor: '#60a5fa',
      };
    case 6:
      return {
        color: 'rgba(5, 150, 105, 0.2)',
        textColor: '#10b981',
        borderColor: '#10b981',
      };
    default:
      return {
        color: 'green',
        textColor: 'white',
        borderColor: 'green',
      };
  }
};
