import { Images } from "@config";

const HotelData = [
  {
    id: "1",
    image: Images.room1,
    name: "Boston Hotel",
    location: "553 Gislason Radial",
    price: "$125",
    available: "Book 2 nights get free Breakfast",
    rate: 4.5,
    rateStatus: "Very Good",
    rateCount: "85 of 100",
    numReviews: 100,
    services: [
      { id: "1", icon: "wifi", name: "Free Wifi" },
      { id: "2", icon: "coffee", name: "Free Coffee" },
      { id: "3", icon: "bath", name: "Free Bath" },
      { id: "4", icon: "car", name: "Free Car" },
      { id: "5", icon: "paw", name: "Free Paw" },
      { id: "6", icon: "futbol", name: "Free Futbol" }
    ]
  },
  {
    id: "2",
    image: Images.room2,
    name: "Brisbane Hotel",
    location: "623 Cathrine Port",
    price: "$199",
    available: "Book 2 nights get free Breakfast",
    rate: 4,
    rateStatus: "Very Good",
    rateCount: "85 of 100",
    numReviews: 99,
    services: [
      { id: "1", icon: "wifi", name: "Free Wifi" },
      { id: "2", icon: "coffee", name: "Free Coffee" },
      { id: "3", icon: "bath", name: "Free Bath" },
      { id: "4", icon: "car", name: "Free Car" },
      { id: "5", icon: "paw", name: "Free Paw" },
      { id: "6", icon: "futbol", name: "Free Futbol" }
    ]
  },
  {
    id: "3",
    image: Images.room3,
    name: "Seattle Hotel",
    location: "303 Natasha Manors",
    price: "$399",
    available: "Book 2 nights get free Breakfast",
    rate: 4,
    rateStatus: "Very Good",
    rateCount: "85 of 100",
    numReviews: 89,
    services: [
      { id: "1", icon: "wifi", name: "Free Wifi" },
      { id: "2", icon: "coffee", name: "Free Coffee" },
      { id: "3", icon: "bath", name: "Free Bath" },
      { id: "4", icon: "car", name: "Free Car" },
      { id: "5", icon: "paw", name: "Free Paw" },
      { id: "6", icon: "futbol", name: "Free Futbol" }
    ]
  }
];

export { HotelData };
