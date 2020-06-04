import * as React from 'react';
import {useSelector,useDispatch}  from 'react-redux';
import {View,TouchableOpacity,Image,StyleSheet,TouchableWithoutFeedback} from 'react-native';
import {scale, PrimaryText, SmallText} from 'react-native-normalization-text';
import images from '../../assets/images';
import { Colors } from '../../constants/Theme';
import { Slider } from '@ant-design/react-native';
import { repeatFaceSetting } from '../../actions/live';
import { pad } from '../../constants/Layout';

const LivingFaceCard = (props: {
    singleFaceNumber: number,
    visible: boolean,
    setVisible: (visible: boolean) => any,
    onPressClose: () => any,
    // onPressFaceBeauty: () => any,
    // onPressWhiten: () => any,
    // onPressRedden: () => any,
    // onChangeSetting: () => any,
    onAfterChangeSetting: () => any,
}) => {
    if (!props.visible) {
        return null
    }

    const dispatch = useDispatch();

    // 美颜设置参数
    const {faceBeautySetting} = useSelector((state: any) => state?.live?.pusherConfig);

    enum FaceType {
        beautyLevel = 'beautyLevel',
        whiten = 'whiten',
        redden = 'redden',
    }

    /*
    *  选择美颜项目
    * */
    // const [beautyLevel, setBeautyLevel] : [ boolean, any]= React.useState(true);
    // const [whiten, setWhiten] : [ boolean, any] = React.useState(false);
    // const [redden, setRedden] : [ boolean, any] = React.useState(false);
    const [faceType, setFaceType]: [string, any] = React.useState(FaceType.beautyLevel);

    const [settingType, setSettingType] : [ any, any] = React.useState(
        {beautyLevel: true, whiten: false, redden: false}
    );

    React.useEffect(() => {

    });

    /*
     *  更新美颜
     * */
    const updateFaceType = (type:string) => {
        let newFaceObj = settingType;

        if(newFaceObj[type]) return;

        for(let item in newFaceObj) {
            newFaceObj[item] = false;
        }
        newFaceObj[type] = true;
        setFaceType(type);

        setSettingType(newFaceObj)
    };

    return (
        <View style={styles.box}>
            <TouchableWithoutFeedback onPress={props.onPressClose}>
                <View style={styles.style}/>
            </TouchableWithoutFeedback>
            <View style={styles.card}>
               <View style={styles.cardRow}>
                   <TouchableOpacity style={styles.cell} onPress={() => updateFaceType(FaceType.beautyLevel)}>
                       <Image
                           source={faceType === FaceType.beautyLevel ? images.anchorBeautyAc : images.anchorBeauty}
                           style={styles.img}
                           resizeMode="contain"
                       />
                       <SmallText>美白</SmallText>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.cell} onPress={() => updateFaceType(FaceType.whiten)}>
                       <Image
                           source={faceType === FaceType.whiten ? images.anchorWhiteAc : images.anchorWhite}
                           style={styles.img}
                           resizeMode="contain"
                       />
                       <SmallText>磨皮</SmallText>
                   </TouchableOpacity>
                   <TouchableOpacity style={styles.cell} onPress={() => updateFaceType(FaceType.redden)}>
                       <Image
                           source={faceType === FaceType.redden ? images.anchorReddenAc : images.anchorRedden}
                           style={styles.img}
                           resizeMode="contain"
                       />
                       <SmallText>红润</SmallText>
                   </TouchableOpacity>
               </View>
                <View style={styles.cardBottom}>
                    <TouchableOpacity style={styles.cardRow} onPress={() => {dispatch(repeatFaceSetting())}}>
                        <Image
                            source={images.anchorRepeat}
                            style={styles.imgSm}
                            resizeMode="contain"
                        />
                        <SmallText style={{color: '#000', marginLeft: 4}}>重置</SmallText>
                    </TouchableOpacity>
                    <View style={{flex:1}}>
                        <Slider
                            style={{  }}
                            min={0}
                            max={1}
                            value={faceBeautySetting[faceType]}
                            onAfterChange={(value) => props.onAfterChangeSetting(value,faceType)}
                        />
                    </View>
                    <TouchableOpacity onPress={props.onPressClose}>
                        <Image
                            source={images.pakeUp}
                            style={styles.imgSm}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};

LivingFaceCard.defaultProps = {
};

const styles = StyleSheet.create({
    box: {
        flex: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: Colors.opacityDarkBg,
    },
    style: {
        flex:1
    },
    card: {
        height: 130,
        backgroundColor: '#fff',
        justifyContent:'center'
    },
    cardRow: {
        flexDirection: 'row',
        // borderColor:'red',
        // borderWidth: 1
    },
    cell: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        width: 32,
        height: 35,
    },
    imgSm: {
      width: 20,
      height: 18
    },
    cardBottom: {
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 40
        // borderColor:'red',
        // borderWidth: 1
    }
});

export default LivingFaceCard;