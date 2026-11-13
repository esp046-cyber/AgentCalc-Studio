const CATS=['All','AI Agent Architecture','LLM & Cost Metrics','Business & ROI','Validation & Pitching'];
const A='AI Agent Architecture',L='LLM & Cost Metrics',B='Business & ROI',V='Validation & Pitching';
const GLOSS=[
[A,'AI Agent','Software that uses an LLM to pursue a goal by deciding steps and using tools.','Decides your cost drivers: more autonomy means more calls and more risk.','Agent = model + instructions + tools + loop','cost'],
[A,'Agentic Loop','The repeat cycle of think, act with a tool, observe, then decide again.','Each loop re-sends context, so cost multiplies per iteration.','Cost per run = iterations × tokens × price','cost'],
[A,'Function / Tool Calling','The model asks your code to run a named function and gets the result back.','Every tool call adds tokens and latency.','calls per task = 3 → 3 model turns','cost'],
[A,'MCP (Model Context Protocol)','An open standard for connecting models to tools and data sources.','Reusing MCP servers can cut integration build time.','—','cost'],
[A,'RAG','Retrieval-Augmented Generation: fetch relevant documents and add them to the prompt.','Adds context tokens but reduces hallucination on your own data.','Extra tokens = chunks × chunk size','cost'],
[A,'System Prompt','Standing instructions that define the agent’s role and rules.','It is re-sent every call, so keep it short or cache it.','—','cost'],
[A,'Guardrails','Checks that limit what an agent may say or do.','Defines the autonomy boundary and error tolerance.','—','score'],
[A,'Human-in-the-Loop (HITL)','A person reviews or approves selected agent actions.','Review time reduces savings; skipping it raises risk.','Net saving = saved hours × (1 − review %)','roi'],
[A,'Orchestration','Coordinating models, tools and steps into one workflow.','Choose tooling (n8n or custom code) before estimating build cost.','—','cost'],
[A,'n8n','A workflow automation platform with a visual editor.','Fast to prototype; check execution-based fees at scale.','Cost = base + runs × fee','cost'],
[A,'Serverless Edge (Cloudflare Workers)','Code that runs on a provider’s network and bills per request.','Low idle cost for custom agent back-ends.','Cost ≈ base + requests × rate','cost'],
[L,'Tokens (input / output / cached)','Chunks of text a model reads and writes; cached tokens are re-used at a discount.','Output tokens usually cost more than input tokens.','Cost = in × inPrice + out × outPrice','cost'],
[L,'Context Window','The maximum tokens a model can consider in one call.','Large contexts raise cost per call.','—','cost'],
[L,'Hallucination Rate','How often a model states something false with confidence.','Sets how much review you need.','errors ÷ total answers','score'],
[L,'Latency (TTFT)','Time to first token: how long until the answer starts.','Affects whether users will wait for it.','—','cost'],
[L,'Cost Per Execution (CPE)','What one agent run costs in API and infrastructure.','Must sit well below the value of the task.','CPE = API cost + infra ÷ runs','cost'],
[B,'TAM / SAM / SOM','Total, serviceable and obtainable market.','Shows whether the market justifies the build.','TAM = businesses × ACV; SAM = TAM × %; SOM = SAM × %','market'],
[B,'Unit Economics','Revenue and cost for one customer or one run.','Positive margin per unit is the base of a viable agent.','Margin = (price − cost) ÷ price','cost'],
[B,'TCO (Total Cost of Ownership)','Everything it costs to build and run over time.','Compare it to what businesses pay today.','TCO = build + run × months','roi'],
[B,'Payback Period','Time to earn back the build cost.','Buyers favor short paybacks.','weeks = build ÷ weekly net saving','roi'],
[B,'ROI','Net gain relative to cost.','The headline number for stakeholders.','(savings − cost) ÷ cost','roi'],
[B,'Value-Based Pricing','Pricing from the value delivered, not your cost.','Often leaves more margin than cost-plus.','price ≈ 10–30% of annual value saved','roi'],
[B,'Ideal Customer Persona (ICP)','A description of the customer who feels the problem most.','Defines your SAM filter.','—','market'],
[V,'Discovery Validation','Interviewing people about what they did in the past, not what they might do.','Proves the problem is real before building.','—','score'],
[V,'MVP / Agent Prototype','The smallest agent that tests the core value.','Keeps the first build cheap.','—','score'],
[V,'Autonomy Boundary','The line between what the agent does alone and what a person decides.','A clear boundary is a pitch strength.','—','score']
].map(a=>({cat:a[0],term:a[1],def:a[2],why:a[3],ex:a[4],jump:a[5]}));
function mountGlossary(el){let c='All',q='';
el.innerHTML='<h2>Glossary</h2><label for=gq>Search terms</label><input id=gq type=search><div id=gc class=pills></div><div id=gl></div>';
const draw=()=>{gc.innerHTML=CATS.map(x=>`<button class=chip aria-pressed=${x==c} data-c="${x}">${x}</button>`).join('');
const r=GLOSS.filter(g=>(c=='All'||g.cat==c)&&(g.term+g.def).toLowerCase().includes(q));
gl.innerHTML=r.length?r.map((g,i)=>`<button class="card chip" style="display:block;width:100%;border-radius:16px;text-align:left" data-t="${g.term}"><b>${g.term}</b><br><small>${g.def}</small></button>`).join(''):'<p class=empty>No terms match. Clear the search.</p>'};
gq.oninput=e=>{q=e.target.value.toLowerCase();draw()};
el.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.c){c=b.dataset.c;draw()}
if(b.dataset.t){const g=GLOSS.find(x=>x.term==b.dataset.t);dlgb.innerHTML=`<h3>${g.term}</h3><p><b>Plain English:</b> ${g.def}</p><p><b>Why it matters before building:</b> ${g.why}</p><p class=mono><b>Formula / example:</b> ${g.ex}</p><button class="btn acc" id=jmp>Open related calculator</button> `;dlg.showModal();jmp.onclick=()=>{dlg.close();go('calc',g.jump)}}};draw()}

[
[L,'Prompt Caching','Re-using an unchanged prompt prefix at a lower price.','Cuts cost when the system prompt is long.','Saving ≈ cached tokens × (price − cached price)','cost'],
[L,'Temperature','A setting for how random the model output is.','Lower values give steadier results for business tasks.','0 = steady, 1 = varied','cost'],
[L,'Rate Limit','The cap on requests or tokens per minute.','Peak users can hit it and slow the agent.','peak runs/min × tokens per run','cost'],
[A,'Embeddings','Number lists that capture meaning so text can be searched by similarity.','Power search in RAG agents.','—','cost'],
[A,'Vector Database','A store that finds items by embedding similarity.','Adds a monthly infrastructure cost.','—','cost'],
[A,'Fine-Tuning','Training a model further on your examples.','Often unnecessary; try prompting and RAG first.','—','cost'],
[A,'Observability','Logs and traces that show what the agent did and why.','Needed to find errors and track real cost.','—','score'],
[B,'Gross Margin','Revenue left after direct costs, as a percentage.','Shows if each customer is profitable.','(revenue − cost) ÷ revenue','cost'],
[B,'CAC (Customer Acquisition Cost)','What you spend to win one customer.','Must be recovered within a reasonable time.','CAC = sales spend ÷ new customers','market'],
[B,'Churn','The share of customers who leave in a period.','High churn shrinks your obtainable market.','lost ÷ starting customers','market'],
[V,'Pilot / Proof of Concept','A small real-world trial with one customer.','Gives real numbers for your ROI inputs.','—','score']
].map(a=>({cat:a[0],term:a[1],def:a[2],why:a[3],ex:a[4],jump:a[5]})).forEach(g=>GLOSS.push(g));
[
[A,'Stateless MCP','An MCP server design that keeps no session between calls, so it scales easily.','Simpler hosting on edge or serverless platforms.','—','cost'],
[A,'Agent-to-Agent (A2A) & Agent Cards','A way for agents to find and call each other, each described by a public card.','Lets one agent hand work to another.','—','cost'],
[A,'AG-UI / A2UI','Ways for an agent to stream its progress and interface state to an app.','Adds streaming work to the build.','—','cost'],
[L,'Reasoning / Thinking Tokens','Hidden tokens a model uses to think before answering, billed as output.','Raises cost on hard tasks.','think tokens × output price','cost'],
[L,'Batch API','Async processing at a discount for work that can wait.','Cuts cost when answers are not urgent.','cost × 0.5','cost'],
[L,'Context Caching TTL','How long a cached prompt stays available (for example 5 minutes or 1 hour).','Longer TTL costs more to write but helps repeated use.','avg = (write + 0.1 × reads) ÷ (reads + 1)','cost'],
[A,'LLM-as-a-Judge','Using one model to score another model’s answers.','A way to check quality at scale; adds calls.','—','score'],
[B,'Outcome-Based Pricing','Charging per result, such as a resolved ticket.','Aligns price with value delivered.','price ≈ value per outcome × share','roi'],
[B,'AP2 / x402','Protocols for agent payments.','Matter if your agent buys or charges per action.','—','roi']
].map(a=>({cat:a[0],term:a[1],def:a[2],why:a[3],ex:a[4],jump:a[5]})).forEach(g=>GLOSS.push(g));
