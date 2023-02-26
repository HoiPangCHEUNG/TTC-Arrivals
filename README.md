# TTC Next

TTC Next is a real-time transit application that provides estimated arrival times (eta) for TTC buses and streetcars. With TTC Next, users can quickly and easily plan their commute and stay up-to-date with the latest arrival times. [Demo](https://hoipangcheung.github.io/TTC-Arrivals/)

## Features

You can bookmark specific estimated time of arrival for your next bus or streetcar to the home page. With this feature, you can instantly access the information you need whenever you open the app, without having to search for it again. This feature makes it easy to keep track of the ETAs for your preferred routes and stops.

Other features include:

- Real-time arrival data for TTC buses and streetcars
- Complete route information

## Prerequisites

- `npm`
- `docker`

## Getting Started

Run the app locally

```
npm install
npm run start
```

Run the app with Docker

```
docker-compose up
```

## Usage

- Enter the route number you are interested in into the search bar.
- Click the "Search" button to retrieve a list of stops for that route.
- Select the stop you are interested in from the list.
- Add specific eta to favourite for quick access in the future

That's it! With just a few simple steps, you can quickly and easily find out when the next bus or streetcar will be arriving at your chosen stop.

## Contributing

We welcome contributions from other developers! To contribute to TTC Nrrivals, please follow these steps:

- Fork the repository.
- Create a new branch for your changes.
- Make your changes and commit them to your branch.
- Submit a pull request to merge your changes back into the main branch.

## License

TTC Next is licensed under the MIT License.

## References

TTC Next is built using data from [TTC Real-Time Next Vehicle Arrival (NVAS)](https://open.toronto.ca/dataset/ttc-real-time-next-vehicle-arrival-nvas/).

## Inspiration

This project was inspired by the work of the original authors of [ttc-bus-eta](https://github.com/thomassth/ttc-bus-eta). While this project is not a direct continuation of their work, it would not have been possible without their initial contributions. We would like to extend our thanks to them for providing a foundation upon which we could build this project.
