async function notifyCustomer() {
  try {
    const customer = await getCustomer(1);
    console.log("Customer: ", customer);
    if (customer.isGold) {
      const movies = await getTopMovies();
      console.log("Top Movies: ", movies);
      await sendMail(customer.email, movies);
      console.log("Email Sent ....");
    }
  } catch (error) {
    return new Error("Sorry Can't Sent Email...");
  }
}
notifyCustomer();

function getCustomer(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: "1",
        name: "Mudassir",
        isGold: true,
        email: "email",
      });
    }, 4000);
  });
}

function getTopMovies() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["movie1", "movie2"]);
    }, 4000);
  });
}

function sendMail(email, movies) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 4000);
  });
}
