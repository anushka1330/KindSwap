/**
 * Extract only the first name from a full name string.
 * Example: "Rahul Sharma" -> "Rahul"
 */
export function getFirstName(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  const trimmed = fullName.trim();
  if (!trimmed) return '';
  // If email was passed as fallback, strip @domain
  if (trimmed.includes('@')) {
    return trimmed.split('@')[0];
  }
  return trimmed.split(/\s+/)[0];
}

/**
 * Dynamic time-based greeting using user's local browser time.
 * - 05:00 - 11:59: Good morning, [FirstName]
 * - 12:00 - 16:59: Good afternoon, [FirstName]
 * - 17:00 - 04:59: Good evening, [FirstName]
 */
export function getTimeBasedGreeting(fullName) {
  const firstName = getFirstName(fullName);
  const hour = new Date().getHours();
  let salutation = 'Good morning';

  if (hour >= 12 && hour < 17) {
    salutation = 'Good afternoon';
  } else if (hour >= 17 || hour < 5) {
    salutation = 'Good evening';
  }

  return firstName ? `${salutation}, ${firstName}` : salutation;
}
