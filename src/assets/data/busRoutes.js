const busRoutes = [
  {
    id: "1",
    from: "ktm",
    to: "pkr",
    provider: "Tourist Bus Seva",
    price: "NPR 800",
    duration: "7 hours",
    departureTime: "9:00 AM",
    type: "Tourist Bus",
    facilities: ["AC", "WiFi", "Water"],
    crowdness: "Low", // New field
  },
  {
    id: "2",
    from: "ktm",
    to: "pkr",
    provider: "Deluxe Night Bus",
    price: "NPR 1200",
    duration: "7 hours",
    departureTime: "5:00 PM",
    type: "Deluxe",
    facilities: ["AC", "WiFi", "Blanket", "Water"],
    crowdness: "High", // New field
  },
  {
  id: '3',
      from: 'ktm',
      to: 'cht',
      provider: 'Local Bus',
      price: 'NPR 300',
      duration: '4 hours',
      departureTime: '8:00 AM',
      type: 'Local',
      facilities: ['Water'],
      crowdness:"Low",
    },
];

export default busRoutes