export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 100;
};

export const validateAddress = (address) => {
  return address && address.trim().length >= 5 && address.trim().length <= 255;
};

export const validateCity = (city) => {
  return city && city.trim().length >= 2 && city.trim().length <= 100;
};

export const validateState = (state) => {
  return state && state.trim().length >= 2 && state.trim().length <= 100;
};

export const validateZipCode = (zipCode) => {
  return zipCode && /^[0-9]{5}(-[0-9]{4})?$/.test(zipCode);
};

export const validateScore = (score) => {
  const num = parseInt(score);
  return !isNaN(num) && num >= 1 && num <= 5;
};

export const validateComment = (comment) => {
  if (!comment) return true;
  return comment.trim().length <= 1000;
};
