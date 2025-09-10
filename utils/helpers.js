function formatClientList(assigned_clients) {
  // Assigned clients is an array of objects with a "client_name" property.
  // find the object with the name "Introduction to LineaBlu COE" and place it at the top of the list
  assigned_clients.sort((a, b) => {
    if (a.client_name === "Introduction to LineaBlu COE") return -1;
    if (b.client_name === "Introduction to LineaBlu COE") return 1;
    return 0;
  });
  return assigned_clients;
}

module.exports = { formatClientList };
