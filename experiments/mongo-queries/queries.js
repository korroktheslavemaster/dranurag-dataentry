db.onemgdrugs.aggregate([
  {
    $group: {
      _id: "$id",
      name: { $first: "$name" },
      count: { $sum: 1 },
      frequencies: { $addToSet: "$frequency" },
      dosages: { $addToSet: "$dosage" },
      durations: { $addToSet: "$duration" },
      specialComments: { $addToSet: "$specialComments" }
    }
  }
]);
