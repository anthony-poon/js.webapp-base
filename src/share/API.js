import URI from "urijs";
import URITemplate from "urijs/src/URITemplate";
const ENV_API = process.env.REACT_APP_API_URL || process.env.PUBLIC_URL;

const API = {
    root: ENV_API,
    login: () => URI(ENV_API + "/auth/login").normalize().toString(),
    register: () => URI(ENV_API + "/auth/register").normalize().toString() ,
    member: {
        example: ({ exampleId } = {}) => {
            const template = new URITemplate(ENV_API + "/member/{exampleId}");
            return URI(template.expand({
                exampleId: exampleId
            })).normalize().toString();
        },
    }
};

export default API;