import URI from "urijs";
import URITemplate from "urijs/src/URITemplate";
const ENV_API = process.env.REACT_APP_API_URL || process.env.PUBLIC_URL;

const API = {
    root: ENV_API,
    login: () => URI(ENV_API + "/auth/login").normalize().toString(),
    register: () => URI(ENV_API + "/auth/register").normalize().toString() ,
    admin: {
        users: () => URI(ENV_API + "/admin/users").normalize().toString(),
        testCenters: ({ testCenterId } = {}) => {
            const template = new URITemplate(ENV_API + "/admin/test-centers/{testCenterId}");
            return URI(template.expand({
                testCenterId: testCenterId
            })).normalize().toString();
        },
        exams: ({ examId } = {}) => {
            const template = new URITemplate(ENV_API + "/admin/exams/{examId}");
            return URI(template.expand({
                examId: examId
            })).normalize().toString();
        },
        holidays: ({ testCenterId }) => {
            const template = new URITemplate(ENV_API + "/admin/test-centers/{testCenterId}/holiday");
            return URI(template.expand({
                testCenterId: testCenterId
            })).normalize().toString();
        }
    },
    member: {
        exams: ({ examId } = {}) => {
            const template = new URITemplate(ENV_API + "/member/exams/{examId}");
            return URI(template.expand({
                examId: examId
            })).normalize().toString();
        },
        testCenters: ({ testCenterId } = {}) => {
            const template = new URITemplate(ENV_API + "/member/test-centers/{testCenterId}");
            return URI(template.expand({
                testCenterId: testCenterId
            })).normalize().toString();
        },
        holidays: ({ testCenterId }) => {
            const template = new URITemplate(ENV_API + "/member/test-centers/{testCenterId}/holidays");
            return URI(template.expand({
                testCenterId: testCenterId
            })).normalize().toString();
        },
        timeSlots: ({ testCenterId }) => {
            const template = new URITemplate(ENV_API + "/member/test-centers/{testCenterId}/time-slots");
            return URI(template.expand({
                testCenterId: testCenterId
            })).normalize().toString();
        }
    }
};

export default API;