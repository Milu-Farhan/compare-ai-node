export const isPasswordValid = (val, { req }) => {
  if (!val || val.length < 8 || !/[A-Z]/.test(val) || !/\d/.test(val)) {
    throw new Error(
      "Password must contain at least one uppercase letter and one numeric digit and minimum 8 character"
    );
  }

  return true;
};
