const LoadingSvg = function (){
    return (
        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700" style={{ position: "absolute", top: "0", left: 0, display: "flex", height: "100%", width: "100%", background: "", textAlign: "center", opacity: "0.5" }}>
            <svg style={{ margin: "auto" }} width={"100px"} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle fill="#FEFCFF" stroke="#FEFCFF" strokeWidth="15" r="15" cx="40" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.4"></animate></circle><circle fill="#FEFCFF" stroke="#FEFCFF" strokeWidth="15" r="15" cx="100" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="-.2"></animate></circle><circle fill="#FEFCFF" stroke="#FEFCFF" strokeWidth="15" r="15" cx="160" cy="65"><animate attributeName="cy" calcMode="spline" dur="2" values="65;135;65;" keySplines=".5 0 .5 1;.5 0 .5 1" repeatCount="indefinite" begin="0"></animate></circle></svg>
        </div>
    )
}

export default LoadingSvg;