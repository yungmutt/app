import React from "react";
import {View} from "react-native";

//sizedbox works as a separator
interface Props {
    height?: number,
    width?: number
}

const SizedBox: React.FC<Props> = ({height, width}) => {
    return <View style={{height, width}}/>
}

export default SizedBox