REPO_USER=talg70
NAMESPACE=kafka
SECRET=topsecret

helm uninstall -n $NAMESPACE syfter-tracker
helm uninstall -n $NAMESPACE syfter-worker
helm uninstall -n $NAMESPACE syfter-gql
kubectl create namespace $NAMESPACE

# syfter-tracker
docker build -t $REPO_USER/syfter-tracker ./syfter-tracker
docker push  $REPO_USER/syfter-tracker
helm install --set image.repository=$REPO_USER/syfter-tracker syfter-tracker ./syfter-tracker/helm -n $NAMESPACE

# syfter-worker
docker build -t $REPO_USER/syfter-worker ./syfter-worker
docker push  $REPO_USER/syfter-worker
helm install --set image.repository=$REPO_USER/syfter-worker syfter-worker ./syfter-worker/helm -n $NAMESPACE

# syfter-gql
docker build -t $REPO_USER/syfter-gql ./syfter-gql
docker push  $REPO_USER/syfter-gql
helm install --set image.repository=$REPO_USER/syfter-gql --set secret=$SECRET syfter-gql ./syfter-gql/helm -n $NAMESPACE
sleep 10
kubectl port-forward  -n kafka service/syfter-gql 4001:80 &
open http://localhost:4001