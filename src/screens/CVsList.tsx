export const CVsList = (props:{cvs:Array<any>}) => {

    return (
        <ul>
        {
            props.cvs.map((cv) => {
                return (
                    <li>{cv.name}</li>
                );
            })
        }
        </ul>
    );
};