import axios from "axios";

function Index() {
    async function test(e) {
        e.preventDefault();
        const res = await axios.get("/place/678a93100ecfea6542b3b855");
        console.log(res)
    }
    return (
        <>
            Index page here
            <button onClick={e => test(e)}>test</button>
        </>
    );
}

export default Index;