This Jenkins pipeline accepts an AWS account (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) that have an assumed IAM role mapped to k8s right to apply k8s workload in k8s astd namespace.

The default role (and displayed in input IAM_ROLE) is "astd-eks-ProjectEdit_fhk".
If your AWS IAM account does not assume such IAM role, but another role instead (e.g. "astd-eks-ProjectAdmin_fhk", "astd-eks-ClusterAdmin-plus-aws-full-support_fhk"), please input it in input IAM_ROLE).

The default to-be-applied file (and displayed in input WORKLOAD_YAML) is "eks/workload.yaml" (i.e. stored in your git project as {project root}/eks/workload.yaml).
Input another yaml file in input WORKLOAD_YAML as you like.

If such pipeline fails by any reason, you can still perform manual apply k8s workload in EKS (provided that you have the appropriate assumed role), like below, with awscli and kubectl tools:

[lendus@ocp4router eks]$ aws configure --profile astd-test
AWS Access Key ID [****************W5OP]:
AWS Secret Access Key [****************Lnwr]:
Default region name [ap-east-1]:
Default output format [json]:
[lendus@ocp4router eks]$ aws sts get-caller-identity --profile astd-test
{
    "UserId": "AIDAUPFAHXYRY6CKYHDY3",
    "Account": "307426213411",
    "Arn": "arn:aws:iam::307426213411:user/lendus_chan_test"
}
[lendus@ocp4router eks]$ export $(printf "AWS_ACCESS_KEY_ID=%s AWS_SECRET_ACCESS_KEY=%s AWS_SESSION_TOKEN=%s" \
> $(aws sts assume-role --profile astd-test \
> --role-arn arn:aws:iam::307426213411:role/astd-eks-ProjectEdit_fhk \
> --role-session-name lendus-project-edit \
> --query "Credentials.[AccessKeyId,SecretAccessKey,SessionToken]" \
> --output text))
[lendus@ocp4router eks]$ aws sts get-caller-identity
{
    "UserId": "AROAUPFAHXYRQWDLPNBZ5:lendus-project-edit",
    "Account": "307426213411",
    "Arn": "arn:aws:sts::307426213411:assumed-role/astd-eks-ProjectEdit_fhk/lendus-project-edit"
}
[lendus@ocp4router eks]$ aws eks update-kubeconfig --name astd
Updated context arn:aws:eks:ap-east-1:307426213411:cluster/astd in /home/lendus/.kube/config
[lendus@ocp4router eks]$ kubectl get node
Error from server (Forbidden): nodes is forbidden: User "projectEditor:lendus-project-edit" cannot list resource "nodes" in API group "" at the cluster scope
[lendus@ocp4router eks]$ kubectl apply -f workload.yaml
deployment.apps/workload-sample configured
