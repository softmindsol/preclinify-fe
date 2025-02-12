const calculateDaysRemaining = selectedDate => {
  if (!selectedDate) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(selectedDate);
  examDate.setHours(0, 0, 0, 0);

  const timeDiff = examDate - today;
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};

export { calculateDaysRemaining };
