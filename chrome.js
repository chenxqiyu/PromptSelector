async function run_cmd() {
    document.querySelector("button[data-testid='queue-button']").click()

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function run() {

    var runlist = []

    runlist = ["", ""]

    runlist = Array.from({
        length: 18
    }, (_, i) => `${i + 1} year old girl`)

    for (const e of runlist) {
        console.log(e)
        app.graph.getNodeById(354).widgets[0].value = e
        run_cmd()
        await sleep(10)

    }
}

window.mcp = function () {

    window.socket = new WebSocket("ws://localhost:9998");

    window.socket.onopen = () => {
        console.log('connected', '已连接到服务器');
    }
        ;

    window.socket.onclose = () => {
        console.log('disconnected', '已断开连接');
    }
        ;

    window.socket.onerror = (error) => {
        console.log('error', `错误: ${error}`);
    }
        ;

    window.socket.onmessage = (event) => {
        console.log(event.data);
        var message = JSON.parse(event.data);
        console.log(message)
        console.log(message.way);
        console.log(message.prompt);

        var 提示词id = 66
        var 模型id = 28
        // 获取原始的 prompt 字符串
        const rawPrompt = message.prompt || "";

        // 1. 提取所有的 <lora:xxx> 字符串
        // 使用正则表达式全局匹配，找出所有被尖括号包围且以 lora: 开头的片段
        const loraMatches = rawPrompt.match(/<lora:[^>]+>/g) || [];
        // 将提取出的 lora 用逗号拼接成字符串（如果没有匹配到，则为空字符串）
        const loraString = loraMatches.join('');

        // 2. 提取普通的提示词
        // 将原始字符串中所有的 lora 片段替换为空，并清理掉多余的逗号和空格
        const normalPrompt = rawPrompt.replace(/<lora:[^>]+>/g, '')// 移除所有 lora 片段
            .replace(/,,/g, ',')// 替换可能出现的连续逗号
            .replace(/^,|,$/g, '')// 去除开头和结尾的逗号
            .trim();
        // 去除首尾空格

        console.log("提取的 Lora:", loraString);
        console.log("提取的提示词:", normalPrompt);

        // 3. 赋值给 ComfyUI 的节点
        // 节点 28 赋值 Lora 字符串
        if (app.graph.getNodeById(模型id)) {
            app.graph.getNodeById(模型id).widgets[0].value = "";
            app.graph.getNodeById(模型id).widgets[0].value = loraString;
        }

        // 节点 66 赋值普通提示词
        if (app.graph.getNodeById(提示词id)) {
            app.graph.getNodeById(提示词id).widgets[0].value = normalPrompt;
        }
        run_cmd()
    }
        ;

}
window.mcp()

function wayd() {
    // 1. 获取原始数据数组 (假设结果是 ["1", "2", "3"])
    const nodeCount = app.graph.getNodeById(294).widgets[4].options.values.length;

    const sourceList = app.graph.getNodeById(294).widgets[4].options.values;

    // 2. 定义重复次数
    const repeatCount = 1;

    // 3. 处理逻辑：遍历每个值，将其重复9次，最后将所有结果合并
    var res = sourceList.map(val => Array(repeatCount).fill(val).join(";")).join(";");
    console.log(res)

    // 1. 获取原始字符串（例如 "A;B;C"）
    const baseString = app.graph.getNodeById(294).widgets[5].options.values.join(";");

    // 2. 定义重复次数（根据之前的上下文，这里是9次）

    // 3. 将该字符串重复9次，并用分号连接
    // 结果类似: A;B;C;A;B;C;A;B;C;...
    var res2 = Array(nodeCount).fill(baseString).join(";")
}
//run()

//console.log(res2)

//copy(app.graph.getNodeById(294).widgets[4].options.values.join(";"))
//copy(app.graph.getNodeById(294).widgets[5].options.values.join(";"))
//euler;euler_cfg_pp;euler_ancestral;euler_ancestral_cfg_pp;heun;heunpp2;exp_heun_2_x0;exp_heun_2_x0_sde;dpm_2;dpm_2_ancestral;lms;dpm_fast;dpm_adaptive;dpmpp_2s_ancestral;dpmpp_2s_ancestral_cfg_pp;dpmpp_sde;dpmpp_sde_gpu;dpmpp_2m;dpmpp_2m_cfg_pp;dpmpp_2m_sde;dpmpp_2m_sde_gpu;dpmpp_2m_sde_heun;dpmpp_2m_sde_heun_gpu;dpmpp_3m_sde;dpmpp_3m_sde_gpu;ddpm;lcm;ipndm;ipndm_v;deis;res_multistep;res_multistep_cfg_pp;res_multistep_ancestral;res_multistep_ancestral_cfg_pp;gradient_estimation;gradient_estimation_cfg_pp;er_sde;seeds_2;seeds_3;sa_solver;sa_solver_pece;ddim;uni_pc;uni_pc_bh2
//simple;sgm_uniform;karras;exponential;ddim_uniform;beta;normal;linear_quadratic;kl_optimal
