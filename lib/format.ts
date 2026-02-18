export function formatCLP(amount: number): string {
  return '$' + amount.toLocaleString('es-CL');
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const isDateOnly = !/T\d/.test(dateStr);
  const day = isDateOnly ? date.getUTCDate() : date.getDate();
  const month = isDateOnly ? date.getUTCMonth() : date.getMonth();
  const dayOfWeek = isDateOnly ? date.getUTCDay() : date.getDay();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  return `${days[dayOfWeek]} ${day} ${months[month]}`;
}

export function formatTime(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
}

export function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  return formatDate(timestamp);
}
