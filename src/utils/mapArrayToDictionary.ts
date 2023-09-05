export default function mapArrayToDictionary(array: any[], identifier = "id") {
  return Object.assign(
    {},
    ...array.map((item) => ({ [item[identifier]]: item }))
  );
}
