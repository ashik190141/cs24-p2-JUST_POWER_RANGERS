/* eslint-disable no-inner-declarations */

// import useAuth from "../../Hooks/useAuth";
import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router-dom";
import SectionTitle from "../../Components/SectionTitle";

const StsManagerMinimumVehicle = () => {
    // const [trucks, setTrucks] = useState([]);
    // const { user } = useAuth();
    let allData = useLoaderData();
    let oldTrucks = allData?.trucks;

    let subsets = [];
    let uniqueSubsets = [];
    let trucks = oldTrucks?.flatMap((oldTruck) => [
        oldTruck,
        oldTruck,
        oldTruck,
    ]);
    // console.log(trucks);
    // console.log(trucks.length);
    const removeDuplicateSubsets = (subsets) => {
        // Create an empty set to store unique subsets
        const uniqueSubsets = new Set();

        // Iterate through the subsets array
        subsets.forEach((subset) => {
            // Convert the subset to a JSON string to compare with existing subsets
            const subsetString = JSON.stringify(subset);

            // Add the subset string to the set
            uniqueSubsets.add(subsetString);
        });

        // Convert the set back to an array of subsets
        const uniqueSubsetArray = Array.from(uniqueSubsets).map(
            (subsetString) => JSON.parse(subsetString)
        );

        return uniqueSubsetArray;
    };

    if (trucks.length > 0) {
        // Declare subsets variable
        function findSubsets(idx, target, current, trucks) {
            if (target === 0) {
                subsets.push([...current]);
                return;
            }

            if (idx < 0 || target < 0) {
                return;
            }

            findSubsets(idx - 1, target, current, trucks);

            current.push(trucks[idx]);
            findSubsets(
                idx - 1,
                target - trucks[idx].capacity,
                current,
                trucks
            );
            current.pop();
        }

        function findNextSubsetSum(n, arr, target, prefixSum) {
            let dp = Array.from(Array(n + 1), () => Array(prefixSum + 1));
            dp[0][0] = true;
            for (let i = 1; i <= prefixSum; i++) {
                dp[0][i] = false;
            }
            for (let i = 1; i <= n; i++) {
                for (let j = 0; j <= prefixSum; j++) {
                    if (arr[i - 1] <= j) {
                        let op1 = dp[i - 1][j - arr[i - 1]];
                        let op2 = dp[i - 1][j];
                        dp[i][j] = op1 || op2;
                    } else {
                        dp[i][j] = dp[i - 1][j];
                    }
                }
            }

            while (!dp[n][target]) {
                target++;
            }
            return target;
        }

        let target = allData.stsCapacity; // Set the target capacity
        // let target = 50; // Set the target capacity
        const arr = trucks.map((truck) => truck.capacity);
        // console.log(arr);
        const prefixSum = arr.reduce((acc, val) => acc + val, 0);
        // console.log(prefixSum);
        if (prefixSum < target) target = prefixSum;
        // console.log(target);

        const newTarget = findNextSubsetSum(
            trucks.length,
            arr,
            target,
            prefixSum
        );

        const current = [];
        findSubsets(trucks.length - 1, newTarget, current, trucks);
        uniqueSubsets = removeDuplicateSubsets(subsets);

    }

    const calculateSubsetInfo = (subset) => {
       
        let totalCost = 0;
        let uniqueTrucksCount = 0;
        let truckUsage = {};

        subset.forEach((truck) => {
            totalCost += truck.cost;

            if (truck.name in truckUsage) {
                truckUsage[truck.name]++;
            } else {
                truckUsage[truck.name] = 1;
                uniqueTrucksCount++;
            }
        });

        return { totalCost, uniqueTrucksCount, truckUsage };
    };

    return (
        <div>
            <Helmet>
                <title>EcoSync | Minimum Vehicle</title>
            </Helmet>
            <SectionTitle title={"Minimum Vehicle"}subTitle={"Clean all waste"}></SectionTitle>

            <div className="p-4 w-full md:w-11/12 mx-auto px-2">
                <table className="w-full table-zebra">
                    <thead className="bg-gray-400 grid grid-cols-3">
                            <th className=" py-2">Truck Reg Number</th>
                            <th className=" py-2">Count</th>
                            <th className=" py-2">Total Cost (per KM)</th>
                    </thead>
                    <tbody>
                        {uniqueSubsets?.map((subset, index) => (
                            <tr
                                key={index}
                                className="border-b relative"
                            >
                                <td>
                                    {Object.entries(
                                        calculateSubsetInfo(subset).truckUsage
                                    ).map(([truckName, count], idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-2"
                                        >
                                            <td className="py-2">
                                                {truckName}
                                            </td>
                                            <td className="py-2">
                                                {count} Times
                                            </td>
                                        </div>
                                    ))}
                                </td>
                                <td className="absolute right-12 md:right-48 top-3">
                                    {calculateSubsetInfo(subset).totalCost}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default StsManagerMinimumVehicle;
