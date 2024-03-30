import { Helmet } from "react-helmet-async";
import Lottie from "lottie-react";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import animation from "../../../src/assets/Contact us/Animation - 1701196883827.json";
import SectionTitle from "../../Components/SectionTitle";
import { useState } from "react";
import { useEffect } from "react";
import useAuth from "../../Hooks/useAuth";

const LandManagerMinimumVehicle = () => {
    const [trucks, setTrucks] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetch(`http://localhost:5000/minimum-vehicle-and-cost/${user?.email}`)
            .then((res) => res.json())
            .then((data) => setTrucks(data));
    }, [user?.email]);

    let subsets = [];

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

        const target = trucks.stsCapacity; // Set the target capacity

        const arr = trucks.trucks.map((truck) => truck.capacity);
        const prefixSum = arr.reduce((acc, val) => acc + val, 0);
        const newTarget = findNextSubsetSum(
            trucks.length,
            arr,
            target,
            prefixSum
        );

        const current = [];
        findSubsets(trucks.length - 1, newTarget, current, trucks);
    }

    // for (const subset of subsets) {
    //     for (const truck of subset) {
    //         console.log(truck.name);
    //     }
    //     console.log("next");
    // }

    return (
        <>
            {subsets?.map((subset, index) => (
                <div key={index}>
                    {subset.map((truck, idx) => (
                        <span key={idx}>
                            {truck.name}={truck.cost},{" "}
                        </span>
                    ))}
                </div>
            ))}
        </>
    );
};
export default LandManagerMinimumVehicle;
