import {
    FunctionComponent,
    useCallback,
    ReactNode,
    useState,
    useEffect,
} from "react";
// import { useNavigate } from "react-router-dom";
// import Tabs from "../../../components/Tabs";
// import Warehouse from "./Warehouse";
// import { Box } from "@mui/material";
// import { useTranslation } from "react-i18next";
// import { use } from "i18next";
// import axios from "axios";
// import { set } from "date-fns";
import { getAllUsers, getAllWarehouse } from "../../../APICalls/test";

// interface Person {
//     id: number;
//     name: string;
//     website: string;
// }

interface recyclableItem {
    warehouseRecycId: number;
    recycTypeId: string;
    recycSubtypeId: string;
    recycSubtypeCapacity: number;
    recycTypeCapacity: number;
}

interface Warehouse {
    warehouseId: number;
    wareHouseNameTChi: string;
    wareHouseNameSChi: string;
    wareHouseNameEng: string;
    location: string;
    place: string;
    status: string;
    recyclableSubcategories: Array<recyclableItem>;
}

const Test: FunctionComponent = () => {
    // const [persons, setPersons] = useState<Person[]>([]);
    const [warehouse, setWarehouse] = useState<Warehouse[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getAllWarehouse();
                if (response) {
                    setWarehouse(response.data); // Extract the 'data' property
                    console.log(response.data);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    // return (
    //     <div>
    //         <ul>
    //             {persons.map((person) => (
    //                 <li key={person.id}>{person.website}</li>
    //             ))}
    //         </ul>
    //     </div>
    // );

    return (
        <div>
            <h1>Test</h1>
        </div>
    );
};

export default Test;
