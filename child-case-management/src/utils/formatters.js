export const formatRoleName = (role) => {
  const roleMap = {
    system_admin: 'System Administrator',
    director: 'Director',
    focal_person: 'Focal Person',
  };
  return roleMap[role] || role;
};

export const formatAbuseType = (type) => {
  const typeMap = {
    sexual_abuse: 'Sexual Abuse',
    physical_abuse: 'Physical Abuse',
    neglect: 'Neglect',
    emotional_abuse: 'Emotional Abuse',
  };
  return typeMap[type] || type;
};

export const formatCaseStatus = (status) => {
  const statusMap = {
    reported: 'Reported',
    assigned: 'Assigned',
    under_investigation: 'Under Investigation',
    resolved: 'Resolved',
    closed: 'Closed',
  };
  return statusMap[status] || status;
};

export const formatGender = (gender) => {
  const genderMap = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    prefer_not_to_disclose: 'Prefer Not to Disclose',
  };
  return genderMap[gender] || gender;
};