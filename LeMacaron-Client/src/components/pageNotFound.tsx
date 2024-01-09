import { FunctionComponent } from "react";
interface pageNotFoundProps {

}

const pageNotFound: FunctionComponent<pageNotFoundProps> = () => {

    return (
        <>
            <h1 className="display-1" style={{ height: "70vh", paddingTop: "10%" }}>404 - Page Not Found</h1>
        </>
    )
}

export default pageNotFound;