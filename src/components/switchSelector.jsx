import React from "react";
import SwitchSelector from "react-switch-selector";
import { setMode } from "../store/sentences/action";
import { connect } from "react-redux";

const Switch = (props) => {
  
  const options = [
    {
      label: <span style={{color:props.mode==='focus'?'black':'white',marginBottom:'-5px'}}>Focus</span>,
      value: "focus",
      selectedBackgroundColor: "#FFFFFF",
      selectedFontColor: "#000000",
    },
    {
      label: <span style={{color:props.mode==='+memory'?'black':'white',marginBottom:'-5px'}}>+Memory</span>,
      value: "+memory",
      selectedBackgroundColor: "#FFFFFF",
      selectedFontColor: "#000000",
    },
  ];

  const onChange = (newValue) => {
    props.setMode(newValue);
  };

  const initialSelectedIndex = options.findIndex(
    ({ value }) => value === "focus"
  );
  return (
    <div
      className="react-switch-selector-wrapper"
      style={{
        width: 200,
        float: "right",
        height: 30,
        textAlign: "center",
        margin: "auto",
      }}
    >
      <SwitchSelector
      
        onChange={onChange}
        options={options}
        initialSelectedIndex={initialSelectedIndex}
        backgroundColor={"#000000"}
        fontColor={"#FFFFFF"}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  mode: state.mode,
});

const mapDispatchToProps = { setMode };

export default connect(mapStateToProps, mapDispatchToProps)(Switch);
